import React, { useState } from 'react';
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Edit, 
  Loader2,
  DollarSign,
  MousePointer,
  ShoppingCart,
  TrendingUp,
  Search
} from "lucide-react";
import { toast } from "sonner";

export default function AdminAffiliates() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingAffiliate, setEditingAffiliate] = useState(null);
  const [editData, setEditData] = useState({});

  const { data: affiliates = [], isLoading } = useQuery({
    queryKey: ['affiliates'],
    queryFn: () => base44.entities.Affiliate.list('-created_date')
  });

  const { data: conversions = [] } = useQuery({
    queryKey: ['all-conversions'],
    queryFn: () => base44.entities.AffiliateConversion.list('-created_date')
  });

  const updateAffiliate = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Affiliate.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['affiliates'] });
      toast.success("Affiliate updated");
      setEditingAffiliate(null);
    }
  });

  const updateConversion = useMutation({
    mutationFn: ({ id, data }) => base44.entities.AffiliateConversion.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-conversions'] });
      toast.success("Conversion updated");
    }
  });

  const handleApprove = async (affiliate) => {
    updateAffiliate.mutate({ id: affiliate.id, data: { status: 'approved' } });
    
    // Send approval email
    await base44.integrations.Core.SendEmail({
      to: affiliate.email,
      subject: "Affiliate Account Approved - Noor Herbs",
      body: `Dear ${affiliate.name},\n\nCongratulations! Your affiliate account has been approved.\n\nYour Affiliate ID: ${affiliate.affiliate_id}\n${affiliate.coupon_code ? `Your Coupon Code: ${affiliate.coupon_code}` : ''}\n\nYou can now login to your dashboard and start earning commissions.\n\nBest regards,\nNoor Herbs Team`
    });
  };

  const handleDisable = (affiliate) => {
    updateAffiliate.mutate({ id: affiliate.id, data: { status: 'disabled' } });
  };

  const handleEdit = (affiliate) => {
    setEditingAffiliate(affiliate);
    setEditData({
      commission_type: affiliate.commission_type,
      commission_value: affiliate.commission_value,
      coupon_code: affiliate.coupon_code || '',
      coupon_discount_percent: affiliate.coupon_discount_percent || 10
    });
  };

  const saveEdit = () => {
    updateAffiliate.mutate({ id: editingAffiliate.id, data: editData });
  };

  const markConversionPaid = (conversion) => {
    updateConversion.mutate({ id: conversion.id, data: { status: 'paid' } });
    
    // Update affiliate paid earnings
    const affiliate = affiliates.find(a => a.affiliate_id === conversion.affiliate_id);
    if (affiliate) {
      updateAffiliate.mutate({
        id: affiliate.id,
        data: {
          pending_earnings: (affiliate.pending_earnings || 0) - conversion.commission_amount,
          paid_earnings: (affiliate.paid_earnings || 0) + conversion.commission_amount
        }
      });
    }
  };

  const filteredAffiliates = affiliates.filter(a => 
    a.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.affiliate_id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingAffiliates = filteredAffiliates.filter(a => a.status === 'pending');
  const approvedAffiliates = filteredAffiliates.filter(a => a.status === 'approved');

  // Stats
  const totalEarnings = affiliates.reduce((sum, a) => sum + (a.total_earnings || 0), 0);
  const totalClicks = affiliates.reduce((sum, a) => sum + (a.total_clicks || 0), 0);
  const totalOrders = conversions.length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Affiliate Management</h1>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Affiliates</p>
                <p className="text-2xl font-bold">{affiliates.length}</p>
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
                <p className="text-2xl font-bold">{totalOrders}</p>
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

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search affiliates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12"
          />
        </div>

        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending">
              Pending Approval ({pendingAffiliates.length})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved ({approvedAffiliates.length})
            </TabsTrigger>
            <TabsTrigger value="conversions">
              Conversions ({conversions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-6">
            {pendingAffiliates.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-gray-500">
                  No pending affiliates
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pendingAffiliates.map(affiliate => (
                  <Card key={affiliate.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div>
                          <h3 className="font-bold text-lg">{affiliate.name}</h3>
                          <p className="text-gray-500">{affiliate.email} | {affiliate.phone}</p>
                          {affiliate.youtube_channel && (
                            <p className="text-sm text-blue-600">YouTube: {affiliate.youtube_channel}</p>
                          )}
                          {affiliate.instagram_handle && (
                            <p className="text-sm text-pink-600">Instagram: {affiliate.instagram_handle}</p>
                          )}
                          {affiliate.coupon_code && (
                            <p className="text-sm mt-2">
                              Requested Coupon: <Badge>{affiliate.coupon_code}</Badge>
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={() => handleApprove(affiliate)} className="bg-green-500 hover:bg-green-600">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                          </Button>
                          <Button variant="destructive" onClick={() => handleDisable(affiliate)}>
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="approved" className="mt-6">
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-xl">
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
                        {affiliate.coupon_code && (
                          <Badge variant="secondary">{affiliate.coupon_code}</Badge>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        {affiliate.commission_type === 'fixed' 
                          ? `₹${affiliate.commission_value}` 
                          : `${affiliate.commission_value}%`}
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
                          <Button size="sm" variant="outline" onClick={() => handleEdit(affiliate)}>
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

          <TabsContent value="conversions" className="mt-6">
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-xl">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-4 px-4">Order</th>
                    <th className="text-left py-4 px-4">Affiliate</th>
                    <th className="text-left py-4 px-4">Source</th>
                    <th className="text-left py-4 px-4">Order Total</th>
                    <th className="text-left py-4 px-4">Commission</th>
                    <th className="text-left py-4 px-4">Status</th>
                    <th className="text-left py-4 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {conversions.map(conversion => (
                    <tr key={conversion.id} className="border-b last:border-0">
                      <td className="py-4 px-4">
                        <p className="font-medium">{conversion.order_number}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(conversion.created_date).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="py-4 px-4 font-mono text-sm">{conversion.affiliate_id}</td>
                      <td className="py-4 px-4">
                        <Badge variant={conversion.source === 'coupon' ? 'secondary' : 'outline'}>
                          {conversion.source === 'coupon' ? conversion.coupon_code_used : 'Link'}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">₹{conversion.order_total}</td>
                      <td className="py-4 px-4 font-medium text-green-600">₹{conversion.commission_amount}</td>
                      <td className="py-4 px-4">
                        <Badge className={
                          conversion.status === 'paid' ? 'bg-green-100 text-green-700' :
                          conversion.status === 'approved' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }>
                          {conversion.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        {conversion.status !== 'paid' && (
                          <Button size="sm" onClick={() => markConversionPaid(conversion)}>
                            Mark Paid
                          </Button>
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
                <Select 
                  value={editData.commission_type} 
                  onValueChange={(v) => setEditData({...editData, commission_type: v})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Commission Value ({editData.commission_type === 'fixed' ? '₹' : '%'})</Label>
                <Input 
                  type="number"
                  value={editData.commission_value}
                  onChange={(e) => setEditData({...editData, commission_value: Number(e.target.value)})}
                />
              </div>
              <div>
                <Label>Coupon Code</Label>
                <Input 
                  value={editData.coupon_code}
                  onChange={(e) => setEditData({...editData, coupon_code: e.target.value.toUpperCase()})}
                />
              </div>
              <div>
                <Label>Coupon Discount %</Label>
                <Input 
                  type="number"
                  value={editData.coupon_discount_percent}
                  onChange={(e) => setEditData({...editData, coupon_discount_percent: Number(e.target.value)})}
                />
              </div>
              <Button onClick={saveEdit} className="w-full bg-orange-500 hover:bg-orange-600">
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}