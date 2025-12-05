import React, { useState } from 'react';
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, UserPlus, LogIn } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { createPageUrl } from "@/utils";

export default function AffiliateLogin() {
  const [isLoading, setIsLoading] = useState(false);
  
  // Login form
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  
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
        to: "wahenoorenterprises@gmail.com",
        subject: "New Affiliate Registration - Noor Herbs",
        body: `New affiliate registration:\n\nName: ${registerData.name}\nEmail: ${registerData.email}\nPhone: ${registerData.phone}\nYouTube: ${registerData.youtube_channel || 'N/A'}\nInstagram: ${registerData.instagram_handle || 'N/A'}\nRequested Coupon: ${registerData.requested_coupon || 'N/A'}\n\nPlease review and approve in the admin panel.`
      });
      
      toast.success("Registration successful! Your account is pending approval. We'll notify you once approved.");
      setRegisterData({ name: '', email: '', phone: '', password: '', youtube_channel: '', instagram_handle: '', requested_coupon: '' });
    } catch (error) {
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
                </form>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="register">
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
            </TabsContent>
          </Tabs>
        </Card>

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