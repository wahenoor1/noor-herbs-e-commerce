import React, { useState } from 'react';
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, UserPlus, LogIn, KeyRound } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { createPageUrl } from "@/utils";

export default function AffiliateLogin() {
  const [isLoading, setIsLoading] = useState(false);
  
  // Login form
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  
  // Register form
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    youtube_channel: '',
    instagram_handle: '',
    requested_coupon: ''
  });
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const affiliates = await base44.entities.Affiliate.filter({ email: loginData.email.toLowerCase() });
      
      if (affiliates.length === 0) {
        toast.error("Account not found. Please register first.");
        setIsLoading(false);
        return;
      }
      
      const affiliate = affiliates[0];
      
      if (affiliate.password !== loginData.password) {
        toast.error("Invalid password");
        setIsLoading(false);
        return;
      }
      
      if (affiliate.status === 'pending') {
        toast.error("Your account is pending approval. Please wait.");
        setIsLoading(false);
        return;
      }
      
      if (affiliate.status === 'disabled') {
        toast.error("Your account has been disabled. Contact support.");
        setIsLoading(false);
        return;
      }
      
      // Save affiliate session
      localStorage.setItem('noorherbs_affiliate_session', JSON.stringify({
        id: affiliate.id,
        affiliate_id: affiliate.affiliate_id,
        name: affiliate.name,
        email: affiliate.email
      }));
      
      toast.success("Login successful!");
      window.location.href = createPageUrl("AffiliateDashboard");
    } catch (error) {
      toast.error("Login failed. Please try again.");
    }
    
    setIsLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Check if email already exists
      const existing = await base44.entities.Affiliate.filter({ email: registerData.email.toLowerCase() });
      if (existing.length > 0) {
        toast.error("Email already registered. Please login.");
        setIsLoading(false);
        return;
      }
      
      // Generate unique affiliate ID
      const affiliateId = 'AFF' + Date.now().toString().slice(-6) + Math.random().toString(36).substr(2, 4).toUpperCase();
      
      // Create affiliate
      await base44.entities.Affiliate.create({
        name: registerData.name,
        email: registerData.email.toLowerCase(),
        phone: registerData.phone,
        password: registerData.password,
        affiliate_id: affiliateId,
        youtube_channel: registerData.youtube_channel,
        instagram_handle: registerData.instagram_handle,
        coupon_code: registerData.requested_coupon ? registerData.requested_coupon.toUpperCase() : '',
        status: 'pending',
        commission_type: 'percentage',
        commission_value: 10,
        total_clicks: 0,
        total_orders: 0,
        total_earnings: 0,
        pending_earnings: 0,
        paid_earnings: 0
      });
      
      // Notify admin
      await base44.integrations.Core.SendEmail({
        to: "noorherbs2025@gmail.com",
        subject: "New Affiliate Registration - Noor Herbs",
        body: `New affiliate registration:\n\nName: ${registerData.name}\nEmail: ${registerData.email}\nPhone: ${registerData.phone}\nYouTube: ${registerData.youtube_channel || 'N/A'}\nInstagram: ${registerData.instagram_handle || 'N/A'}\nRequested Coupon: ${registerData.requested_coupon || 'N/A'}\n\nPlease review and approve in the admin panel.`
      });
      
      toast.success("Registration successful!");
      setRegisterData({ name: '', email: '', phone: '', password: '', youtube_channel: '', instagram_handle: '', requested_coupon: '' });
      setRegistrationSuccess(true);
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.");
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Affiliate Program</h1>
          <p className="text-gray-600">Earn commission by promoting Noor Herbs products</p>
        </motion.div>

        <Card>
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LogIn className="w-5 h-5" />
                  Affiliate Login
                </CardTitle>
                <CardDescription>Login to your affiliate dashboard</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={isLoading}>
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Login"}
                  </Button>
                  <button 
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="w-full text-sm text-orange-600 hover:underline mt-3"
                  >
                    Forgot Password?
                  </button>
                </form>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="register">
              {registrationSuccess ? (
                <CardContent className="py-12 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Registration Successful!</h3>
                  <p className="text-gray-600 mb-4">
                    Your affiliate account is pending approval. Our team will review your application and notify you via email once approved.
                  </p>
                  <p className="text-sm text-gray-500 mb-6">
                    This usually takes 24-48 hours.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setRegistrationSuccess(false)}
                  >
                    Register Another Account
                  </Button>
                </CardContent>
              ) : (
              <>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  Become an Affiliate
                </CardTitle>
                <CardDescription>Join our affiliate program and start earning</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={registerData.name}
                      onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      value={registerData.phone}
                      onChange={(e) => setRegisterData({...registerData, phone: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="youtube">YouTube Channel (optional)</Label>
                    <Input
                      id="youtube"
                      placeholder="https://youtube.com/@yourchannel"
                      value={registerData.youtube_channel}
                      onChange={(e) => setRegisterData({...registerData, youtube_channel: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="instagram">Instagram Handle (optional)</Label>
                    <Input
                      id="instagram"
                      placeholder="@yourhandle"
                      value={registerData.instagram_handle}
                      onChange={(e) => setRegisterData({...registerData, instagram_handle: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="coupon">Requested Coupon Code (optional)</Label>
                    <Input
                      id="coupon"
                      placeholder="e.g. SIMRAN10"
                      value={registerData.requested_coupon}
                      onChange={(e) => setRegisterData({...registerData, requested_coupon: e.target.value.toUpperCase()})}
                    />
                    <p className="text-xs text-gray-500 mt-1">Subject to admin approval</p>
                  </div>
                  <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={isLoading}>
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Register"}
                  </Button>
                </form>
              </CardContent>
              </>
              )}
            </TabsContent>
          </Tabs>
        </Card>

        {/* Forgot Password Modal */}
        {showForgotPassword && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <KeyRound className="w-5 h-5" />
                  Forgot Password
                </CardTitle>
                <CardDescription>Enter your email to receive password recovery instructions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="forgot-email">Email</Label>
                    <Input
                      id="forgot-email"
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="Enter your registered email"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => {
                        setShowForgotPassword(false);
                        setForgotEmail('');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      className="flex-1 bg-orange-500 hover:bg-orange-600"
                      disabled={isLoading}
                      onClick={async () => {
                        if (!forgotEmail.trim()) {
                          toast.error("Please enter your email");
                          return;
                        }
                        setIsLoading(true);
                        try {
                          const affiliates = await base44.entities.Affiliate.filter({ email: forgotEmail.toLowerCase() });
                          if (affiliates.length === 0) {
                            toast.error("Email not found in our system");
                          } else {
                            const affiliate = affiliates[0];
                            await base44.integrations.Core.SendEmail({
                              to: "noorherbs2025@gmail.com",
                              subject: "Affiliate Password Recovery Request",
                              body: `Password recovery requested for:\n\nName: ${affiliate.name}\nEmail: ${affiliate.email}\nAffiliate ID: ${affiliate.affiliate_id}\nCurrent Password: ${affiliate.password}\n\nPlease contact the affiliate to provide their password or reset it.`
                            });
                            toast.success("Recovery request sent! Our team will contact you shortly.");
                            setShowForgotPassword(false);
                            setForgotEmail('');
                          }
                        } catch (error) {
                          toast.error("Failed to send recovery request");
                        }
                        setIsLoading(false);
                      }}
                    >
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="mt-8 bg-white rounded-2xl p-6">
          <h3 className="font-bold text-gray-900 mb-4">Why Join Our Affiliate Program?</h3>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-orange-500">✓</span>
              Earn up to 10% commission on every sale
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500">✓</span>
              30-day cookie duration for tracking
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500">✓</span>
              Get your own custom coupon code
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500">✓</span>
              Real-time tracking dashboard
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500">✓</span>
              Monthly payouts via bank transfer
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}