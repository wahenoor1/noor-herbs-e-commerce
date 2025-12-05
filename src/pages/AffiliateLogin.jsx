import React, { useState, useEffect } from 'react';
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Loader2, UserPlus, LogIn, KeyRound, LogOut, Copy, Link2, 
  MousePointer, ShoppingCart, DollarSign, Users, Edit, CheckCircle, XCircle, TrendingUp
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

// Admin credentials
const ADMIN_EMAIL = "noorherbs2025@gmail.com";
const ADMIN_PASSWORD = "Noor@1234";

function CouponCreator({ affiliateId, onCreated }) {
  const [couponCode, setCouponCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const createCoupon = async () => {
    if (!couponCode.trim() || couponCode.length < 4) {
      toast.error("Coupon code must be at least 4 characters");
      return;
    }
    setIsCreating(true);
    
    // Check if coupon already exists
    const existing = await base44.entities.Affiliate.filter({ coupon_code: couponCode.toUpperCase() });
    if (existing.length > 0) {
      toast.error("This coupon code is already taken");
      setIsCreating(false);
      return;
    }
    
    await base44.entities.Affiliate.update(affiliateId, { 
      coupon_code: couponCode.toUpperCase(),
      coupon_discount_percent: 10
    });
    toast.success("Coupon code created!");
    onCreated();
    setIsCreating(false);
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500 text-center">Create your own coupon code</p>
      <div className="flex gap-2">
        <Input 
          placeholder="e.g. YOURNAME10" 
          value={couponCode} 
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
          className="text-center font-bold"
        />
        <Button onClick={createCoupon} disabled={isCreating} className="bg-orange-500 hover:bg-orange-600">
          {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create"}
        </Button>
      </div>
    </div>
  );
}

export default function AffiliateLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [loggedInAffiliate, setLoggedInAffiliate] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Login form
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  
  // Register form
  const [registerData, setRegisterData] = useState({
    name: '', email: '', phone: '', password: '',
    youtube_channel: '', instagram_handle: '', requested_coupon: ''
  });
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Admin edit
  const [editingAffiliate, setEditingAffiliate] = useState(null);
  const [editData, setEditData] = useState({});

  // Check if already logged in
  useEffect(() => {
    const session = localStorage.getItem('noorherbs_affiliate_session');
    if (session) {
      const parsed = JSON.parse(session);
      if (parsed.isAdmin) {
        setIsAdmin(true);
      } else {
        setLoggedInAffiliate(parsed);
      }
    }
  }, []);

  // Fetch affiliate data for logged in user
  const { data: affiliateData, refetch: refetchAffiliate } = useQuery({
    queryKey: ['my-affiliate', loggedInAffiliate?.affiliate_id],
    queryFn: async () => {
      const affiliates = await base44.entities.Affiliate.filter({ affiliate_id: loggedInAffiliate.affiliate_id });
      return affiliates[0];
    },
    enabled: !!loggedInAffiliate?.affiliate_id
  });

  const { data: myConversions = [] } = useQuery({
    queryKey: ['my-conversions', loggedInAffiliate?.affiliate_id],
    queryFn: () => base44.entities.AffiliateConversion.filter({ affiliate_id: loggedInAffiliate.affiliate_id }),
    enabled: !!loggedInAffiliate?.affiliate_id
  });

  // Admin data
  const { data: allAffiliates = [], refetch: refetchAllAffiliates } = useQuery({
    queryKey: ['all-affiliates'],
    queryFn: async () => {
      const all = await base44.entities.Affiliate.list('-created_date');
      // Filter out deleted duplicates
      return all.filter(a => a.status !== 'deleted_duplicate');
    },
    enabled: isAdmin
  });

  const { data: allConversions = [] } = useQuery({
    queryKey: ['all-conversions'],
    queryFn: () => base44.entities.AffiliateConversion.list('-created_date'),
    enabled: isAdmin
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!loginData.email.trim() || !loginData.password.trim()) {
      toast.error("Please enter email and password");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Check admin login
      if (loginData.email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && loginData.password === ADMIN_PASSWORD) {
        localStorage.setItem('noorherbs_affiliate_session', JSON.stringify({ isAdmin: true }));
        setIsAdmin(true);
        setIsLoading(false);
        toast.success("Admin login successful!");
        return;
      }
      
      // Regular affiliate login - fetch all and find by email
      const allAffiliates = await base44.entities.Affiliate.list();
      const affiliate = allAffiliates.find(a => a.email?.toLowerCase() === loginData.email.toLowerCase() && a.status !== 'deleted_duplicate');
      
      if (!affiliate) {
        setIsLoading(false);
        toast.error("Account not found. Please register first.");
        return;
      }
      
      if (affiliate.password !== loginData.password) {
        setIsLoading(false);
        toast.error("Invalid password");
        return;
      }
      
      if (affiliate.status === 'pending') {
        setIsLoading(false);
        toast.error("Your account is pending approval. Please wait for admin approval.");
        return;
      }
      
      if (affiliate.status === 'disabled') {
        setIsLoading(false);
        toast.error("Your account has been disabled. Contact support.");
        return;
      }
      
      const session = {
        id: affiliate.id,
        affiliate_id: affiliate.affiliate_id,
        name: affiliate.name,
        email: affiliate.email
      };
      localStorage.setItem('noorherbs_affiliate_session', JSON.stringify(session));
      setLoggedInAffiliate(session);
      setIsLoading(false);
      toast.success("Login successful!");
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
      toast.error("Login failed. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('noorherbs_affiliate_session');
    setLoggedInAffiliate(null);
    setIsAdmin(false);
    setLoginData({ email: '', password: '' });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!registerData.name.trim() || !registerData.email.trim() || !registerData.phone.trim() || !registerData.password.trim()) {
      toast.error("Please fill all required fields");
      return;
    }
    
    if (registerData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Check if email already exists
      const allAffiliates = await base44.entities.Affiliate.list();
      const activeAffiliates = allAffiliates.filter(a => a.status !== 'deleted_duplicate');
      
      const existingEmail = activeAffiliates.find(a => a.email?.toLowerCase() === registerData.email.toLowerCase());
      if (existingEmail) {
        toast.error("This email is already registered. Please use a different email or login.");
        setIsLoading(false);
        return;
      }
      
      // Check if phone already exists
      const existingPhone = activeAffiliates.find(a => a.phone === registerData.phone);
      if (existingPhone) {
        toast.error("This phone number is already registered. Please use a different phone number.");
        setIsLoading(false);
        return;
      }
      
      const affiliateId = 'AFF' + Date.now().toString().slice(-6) + Math.random().toString(36).substr(2, 4).toUpperCase();
      
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
        coupon_discount_percent: 10,
        total_clicks: 0,
        total_orders: 0,
        total_earnings: 0,
        pending_earnings: 0,
        paid_earnings: 0
      });
      
      // Send email to admin - don't await to prevent blocking
      base44.integrations.Core.SendEmail({
        to: "noorherbs2025@gmail.com",
        subject: "New Affiliate Registration - Noor Herbs",
        body: `New affiliate registration:\n\nName: ${registerData.name}\nEmail: ${registerData.email}\nPhone: ${registerData.phone}\nYouTube: ${registerData.youtube_channel || 'N/A'}\nInstagram: ${registerData.instagram_handle || 'N/A'}\nRequested Coupon: ${registerData.requested_coupon || 'N/A'}`
      }).catch(() => {});
      
      setRegistrationSuccess(true);
      setRegisterData({ name: '', email: '', phone: '', password: '', youtube_channel: '', instagram_handle: '', requested_coupon: '' });
      toast.success("Registration successful! Your account is pending approval.");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.");
    }
    setIsLoading(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const getAffiliateLink = (page = '') => {
    const baseUrl = window.location.origin;
    return `${baseUrl}${page}?aff_id=${affiliateData?.affiliate_id}`;
  };

  // Admin functions
  const [approvingId, setApprovingId] = useState(null);
  const [disablingId, setDisablingId] = useState(null);

  const handleApprove = async (affiliate) => {
    setApprovingId(affiliate.id);
    try {
      await base44.entities.Affiliate.update(affiliate.id, { status: 'approved' });
      await base44.integrations.Core.SendEmail({
        to: affiliate.email,
        subject: "🎉 Affiliate Account Approved - Noor Herbs",
        body: `Dear ${affiliate.name},\n\nCongratulations! Your affiliate account has been approved!\n\nYour Affiliate ID: ${affiliate.affiliate_id}\n${affiliate.coupon_code ? `Your Coupon Code: ${affiliate.coupon_code}` : 'You can create your own coupon code after login.'}\n\nYou can now login to your dashboard and start earning commissions.\n\nLogin at: ${window.location.href}\n\nBest regards,\nNoor Herbs Team`
      });
      toast.success("Affiliate approved & email sent!");
      refetchAllAffiliates();
    } catch (error) {
      toast.error("Failed to approve");
    }
    setApprovingId(null);
  };

  const handleDisable = async (affiliate) => {
    setDisablingId(affiliate.id);
    try {
      await base44.entities.Affiliate.update(affiliate.id, { status: 'disabled' });
      toast.success("Affiliate disabled");
      refetchAllAffiliates();
    } catch (error) {
      toast.error("Failed to disable");
    }
    setDisablingId(null);
  };
  
  const handleReactivate = async (affiliate) => {
    try {
      await base44.entities.Affiliate.update(affiliate.id, { status: 'approved' });
      toast.success("Affiliate reactivated!");
      refetchAllAffiliates();
    } catch (error) {
      toast.error("Failed to reactivate");
    }
  };

  const handleEditAffiliate = (affiliate) => {
    setEditingAffiliate(affiliate);
    setEditData({
      commission_type: affiliate.commission_type || 'percentage',
      commission_value: affiliate.commission_value || 10,
      coupon_code: affiliate.coupon_code || '',
      coupon_discount_percent: affiliate.coupon_discount_percent || 10
    });
  };

  const saveAffiliateEdit = async () => {
    await base44.entities.Affiliate.update(editingAffiliate.id, editData);
    toast.success("Affiliate updated!");
    setEditingAffiliate(null);
    refetchAllAffiliates();
  };

  const markConversionPaid = async (conversion) => {
    await base44.entities.AffiliateConversion.update(conversion.id, { status: 'paid' });
    const affiliate = allAffiliates.find(a => a.affiliate_id === conversion.affiliate_id);
    if (affiliate) {
      await base44.entities.Affiliate.update(affiliate.id, {
        pending_earnings: Math.max(0, (affiliate.pending_earnings || 0) - conversion.commission_amount),
        paid_earnings: (affiliate.paid_earnings || 0) + conversion.commission_amount
      });
    }
    toast.success("Marked as paid!");
    refetchAllAffiliates();
  };

  // ADMIN DASHBOARD
  if (isAdmin) {
    const pendingAffiliates = allAffiliates.filter(a => a.status === 'pending');
    const approvedAffiliates = allAffiliates.filter(a => a.status === 'approved');
    const totalEarnings = allAffiliates.reduce((sum, a) => sum + (a.total_earnings || 0), 0);
    const totalClicks = allAffiliates.reduce((sum, a) => sum + (a.total_clicks || 0), 0);

    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin - Affiliate Management</h1>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>

          {/* Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Affiliates</p>
                  <p className="text-2xl font-bold">{allAffiliates.length}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                  <MousePointer className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Clicks</p>
                  <p className="text-2xl font-bold">{totalClicks}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Conversions</p>
                  <p className="text-2xl font-bold">{allConversions.length}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Commissions</p>
                  <p className="text-2xl font-bold">₹{totalEarnings}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="pending">
            <TabsList>
              <TabsTrigger value="pending">Pending ({pendingAffiliates.length})</TabsTrigger>
              <TabsTrigger value="approved">Approved ({approvedAffiliates.length})</TabsTrigger>
              <TabsTrigger value="disabled">Disabled ({allAffiliates.filter(a => a.status === 'disabled').length})</TabsTrigger>
              <TabsTrigger value="conversions">Conversions ({allConversions.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="mt-6 space-y-4">
              {pendingAffiliates.length === 0 ? (
                <Card><CardContent className="py-12 text-center text-gray-500">No pending affiliates</CardContent></Card>
              ) : pendingAffiliates.map(affiliate => (
                <Card key={affiliate.id}>
                  <CardContent className="p-6 flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-lg">{affiliate.name}</h3>
                      <p className="text-gray-500">{affiliate.email} | {affiliate.phone}</p>
                      {affiliate.coupon_code && <Badge className="mt-2">{affiliate.coupon_code}</Badge>}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleApprove(affiliate)} 
                        className="bg-green-500 hover:bg-green-600"
                        disabled={approvingId === affiliate.id}
                      >
                        {approvingId === affiliate.id ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                        Approve
                      </Button>
                      <Button 
                        variant="destructive" 
                        onClick={() => handleDisable(affiliate)}
                        disabled={disablingId === affiliate.id}
                      >
                        {disablingId === affiliate.id ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <XCircle className="w-4 h-4 mr-2" />}
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="approved" className="mt-6">
              <div className="overflow-x-auto bg-white rounded-xl">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-4 px-4">Affiliate</th>
                      <th className="text-left py-4 px-4">ID / Coupon</th>
                      <th className="text-left py-4 px-4">Commission</th>
                      <th className="text-left py-4 px-4">Stats</th>
                      <th className="text-left py-4 px-4">Earnings</th>
                      <th className="text-left py-4 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {approvedAffiliates.map(affiliate => (
                      <tr key={affiliate.id} className="border-b last:border-0">
                        <td className="py-4 px-4">
                          <p className="font-medium">{affiliate.name}</p>
                          <p className="text-sm text-gray-500">{affiliate.email}</p>
                        </td>
                        <td className="py-4 px-4">
                          <p className="font-mono text-sm">{affiliate.affiliate_id}</p>
                          {affiliate.coupon_code && <Badge variant="secondary">{affiliate.coupon_code}</Badge>}
                        </td>
                        <td className="py-4 px-4">
                          {affiliate.commission_type === 'fixed' ? `₹${affiliate.commission_value}` : `${affiliate.commission_value}%`}
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm">Clicks: {affiliate.total_clicks || 0}</p>
                          <p className="text-sm">Orders: {affiliate.total_orders || 0}</p>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm text-green-600">Paid: ₹{affiliate.paid_earnings || 0}</p>
                          <p className="text-sm text-orange-600">Pending: ₹{affiliate.pending_earnings || 0}</p>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleEditAffiliate(affiliate)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDisable(affiliate)}>
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="disabled" className="mt-6 space-y-4">
              {allAffiliates.filter(a => a.status === 'disabled').length === 0 ? (
                <Card><CardContent className="py-12 text-center text-gray-500">No disabled affiliates</CardContent></Card>
              ) : allAffiliates.filter(a => a.status === 'disabled').map(affiliate => (
                <Card key={affiliate.id}>
                  <CardContent className="p-6 flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-lg">{affiliate.name}</h3>
                      <p className="text-gray-500">{affiliate.email} | {affiliate.phone}</p>
                      <Badge variant="destructive" className="mt-2">Disabled</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => handleReactivate(affiliate)} className="bg-green-500 hover:bg-green-600">
                        <CheckCircle className="w-4 h-4 mr-2" /> Reactivate
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="conversions" className="mt-6">
              <div className="overflow-x-auto bg-white rounded-xl">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-4 px-4">Order</th>
                      <th className="text-left py-4 px-4">Affiliate</th>
                      <th className="text-left py-4 px-4">Source</th>
                      <th className="text-left py-4 px-4">Total</th>
                      <th className="text-left py-4 px-4">Commission</th>
                      <th className="text-left py-4 px-4">Status</th>
                      <th className="text-left py-4 px-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allConversions.map(conversion => (
                      <tr key={conversion.id} className="border-b last:border-0">
                        <td className="py-4 px-4">{conversion.order_number}</td>
                        <td className="py-4 px-4 font-mono text-sm">{conversion.affiliate_id}</td>
                        <td className="py-4 px-4">
                          <Badge variant={conversion.source === 'coupon' ? 'secondary' : 'outline'}>
                            {conversion.source === 'coupon' ? conversion.coupon_code_used : 'Link'}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">₹{conversion.order_total}</td>
                        <td className="py-4 px-4 text-green-600">₹{conversion.commission_amount}</td>
                        <td className="py-4 px-4">
                          <Badge className={conversion.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                            {conversion.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          {conversion.status !== 'paid' && (
                            <Button size="sm" onClick={() => markConversionPaid(conversion)}>Mark Paid</Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>

          {/* Edit Dialog */}
          <Dialog open={!!editingAffiliate} onOpenChange={() => setEditingAffiliate(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Affiliate - {editingAffiliate?.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label>Commission Type</Label>
                  <Select value={editData.commission_type} onValueChange={(v) => setEditData({...editData, commission_type: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Commission Value ({editData.commission_type === 'fixed' ? '₹' : '%'})</Label>
                  <Input type="number" value={editData.commission_value} onChange={(e) => setEditData({...editData, commission_value: Number(e.target.value)})} />
                </div>
                <div>
                  <Label>Coupon Code</Label>
                  <Input value={editData.coupon_code} onChange={(e) => setEditData({...editData, coupon_code: e.target.value.toUpperCase()})} />
                </div>
                <div>
                  <Label>Coupon Discount %</Label>
                  <Input type="number" value={editData.coupon_discount_percent} onChange={(e) => setEditData({...editData, coupon_discount_percent: Number(e.target.value)})} />
                </div>
                <Button onClick={saveAffiliateEdit} className="w-full bg-orange-500 hover:bg-orange-600">Save Changes</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    );
  }

  // AFFILIATE DASHBOARD (after login)
  if (loggedInAffiliate) {
    // Show loading while fetching affiliate data
    if (!affiliateData) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" />
            <p className="text-gray-500">Loading your dashboard...</p>
          </div>
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome, {affiliateData.name}!</h1>
              <p className="text-gray-500">Affiliate ID: {affiliateData.affiliate_id}</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>

          {/* Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <MousePointer className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                <p className="text-2xl font-bold">{affiliateData.total_clicks || 0}</p>
                <p className="text-sm text-gray-500">Total Clicks</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <p className="text-2xl font-bold">{affiliateData.total_orders || 0}</p>
                <p className="text-sm text-gray-500">Total Orders</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <DollarSign className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                <p className="text-2xl font-bold">₹{affiliateData.pending_earnings || 0}</p>
                <p className="text-sm text-gray-500">Pending Earnings</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                <p className="text-2xl font-bold">₹{affiliateData.paid_earnings || 0}</p>
                <p className="text-sm text-gray-500">Paid Earnings</p>
              </CardContent>
            </Card>
          </div>

          {/* Links & Coupon */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Link2 className="w-5 h-5" /> Your Affiliate Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Input value={getAffiliateLink('')} readOnly className="text-sm" />
                  <Button size="icon" variant="outline" onClick={() => copyToClipboard(getAffiliateLink(''))}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Input value={getAffiliateLink('/Shop')} readOnly className="text-sm" />
                  <Button size="icon" variant="outline" onClick={() => copyToClipboard(getAffiliateLink('/Shop'))}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Coupon Code</CardTitle>
              </CardHeader>
              <CardContent>
                {affiliateData.coupon_code ? (
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-6 py-3 rounded-xl">
                      <span className="text-2xl font-bold">{affiliateData.coupon_code}</span>
                      <Button size="icon" variant="ghost" onClick={() => copyToClipboard(affiliateData.coupon_code)}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">{affiliateData.coupon_discount_percent || 10}% discount for customers</p>
                  </div>
                ) : (
                  <CouponCreator affiliateId={affiliateData.id} onCreated={refetchAffiliate} />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Commission Info */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Commission Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <span>Your Commission Rate:</span>
                <span className="text-xl font-bold text-orange-600">
                  {affiliateData.commission_type === 'fixed' ? `₹${affiliateData.commission_value}` : `${affiliateData.commission_value}%`} per sale
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Recent Conversions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Conversions</CardTitle>
            </CardHeader>
            <CardContent>
              {myConversions.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No conversions yet. Share your links to start earning!</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2">Order</th>
                        <th className="text-left py-3 px-2">Source</th>
                        <th className="text-left py-3 px-2">Total</th>
                        <th className="text-left py-3 px-2">Commission</th>
                        <th className="text-left py-3 px-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myConversions.slice(0, 10).map(conv => (
                        <tr key={conv.id} className="border-b last:border-0">
                          <td className="py-3 px-2">{conv.order_number}</td>
                          <td className="py-3 px-2">
                            <Badge variant={conv.source === 'coupon' ? 'secondary' : 'outline'}>
                              {conv.source === 'coupon' ? conv.coupon_code_used : 'Link'}
                            </Badge>
                          </td>
                          <td className="py-3 px-2">₹{conv.order_total}</td>
                          <td className="py-3 px-2 text-green-600">₹{conv.commission_amount}</td>
                          <td className="py-3 px-2">
                            <Badge className={conv.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                              {conv.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  } // end of affiliate dashboard

  // LOGIN / REGISTER PAGE
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
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
                <CardTitle className="flex items-center gap-2"><LogIn className="w-5 h-5" /> Affiliate Login</CardTitle>
                <CardDescription>Login to your affiliate dashboard</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="login-email">Email</Label>
                    <Input id="login-email" type="email" value={loginData.email} onChange={(e) => setLoginData({...loginData, email: e.target.value})} required />
                  </div>
                  <div>
                    <Label htmlFor="login-password">Password</Label>
                    <Input id="login-password" type="password" value={loginData.password} onChange={(e) => setLoginData({...loginData, password: e.target.value})} required />
                  </div>
                  <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={isLoading}>
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Login"}
                  </Button>
                  <button type="button" onClick={() => setShowForgotPassword(true)} className="w-full text-sm text-orange-600 hover:underline mt-3">
                    Forgot Password?
                  </button>
                </form>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="register">
              {registrationSuccess ? (
                <CardContent className="py-12 text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Registration Successful!</h3>
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                    <p className="text-green-800 font-medium mb-2">What happens next?</p>
                    <ul className="text-sm text-green-700 text-left space-y-2">
                      <li>✓ Your application has been submitted</li>
                      <li>✓ Our team will review your application</li>
                      <li>✓ You will receive an email once approved</li>
                      <li>✓ Approval typically takes 24-48 hours</li>
                    </ul>
                  </div>
                  <p className="text-gray-500 text-sm mb-4">A confirmation email has been sent to your registered email address.</p>
                  <Button variant="outline" onClick={() => setRegistrationSuccess(false)}>Register Another Account</Button>
                </CardContent>
              ) : (
                <>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><UserPlus className="w-5 h-5" /> Become an Affiliate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div>
                        <Label>Full Name *</Label>
                        <Input value={registerData.name} onChange={(e) => setRegisterData({...registerData, name: e.target.value})} required />
                      </div>
                      <div>
                        <Label>Email *</Label>
                        <Input type="email" value={registerData.email} onChange={(e) => setRegisterData({...registerData, email: e.target.value})} required />
                      </div>
                      <div>
                        <Label>Phone *</Label>
                        <Input value={registerData.phone} onChange={(e) => setRegisterData({...registerData, phone: e.target.value})} required />
                      </div>
                      <div>
                        <Label>Password *</Label>
                        <Input type="password" value={registerData.password} onChange={(e) => setRegisterData({...registerData, password: e.target.value})} required />
                      </div>
                      <div>
                        <Label>Requested Coupon Code (optional)</Label>
                        <Input placeholder="e.g. SIMRAN10" value={registerData.requested_coupon} onChange={(e) => setRegisterData({...registerData, requested_coupon: e.target.value.toUpperCase()})} />
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
                <CardTitle className="flex items-center gap-2"><KeyRound className="w-5 h-5" /> Forgot Password</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>Email</Label>
                    <Input type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} placeholder="Enter your registered email" />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => { setShowForgotPassword(false); setForgotEmail(''); }}>Cancel</Button>
                    <Button className="flex-1 bg-orange-500 hover:bg-orange-600" disabled={isLoading} onClick={async () => {
                      if (!forgotEmail.trim()) { toast.error("Please enter your email"); return; }
                      setIsLoading(true);
                      const affiliates = await base44.entities.Affiliate.filter({ email: forgotEmail.toLowerCase() });
                      if (affiliates.length === 0) {
                        toast.error("Email not found");
                      } else {
                        await base44.integrations.Core.SendEmail({
                          to: "noorherbs2025@gmail.com",
                          subject: "Affiliate Password Recovery Request",
                          body: `Password recovery for:\n\nName: ${affiliates[0].name}\nEmail: ${affiliates[0].email}\nPassword: ${affiliates[0].password}`
                        });
                        toast.success("Recovery request sent!");
                        setShowForgotPassword(false);
                        setForgotEmail('');
                      }
                      setIsLoading(false);
                    }}>
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
            <li className="flex items-start gap-2"><span className="text-orange-500">✓</span> Earn up to 10% commission</li>
            <li className="flex items-start gap-2"><span className="text-orange-500">✓</span> 30-day cookie tracking</li>
            <li className="flex items-start gap-2"><span className="text-orange-500">✓</span> Custom coupon code</li>
            <li className="flex items-start gap-2"><span className="text-orange-500">✓</span> Real-time dashboard</li>
          </ul>
        </div>
      </div>
    </div>
  );
}