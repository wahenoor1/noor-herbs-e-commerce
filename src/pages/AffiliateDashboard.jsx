import React, { useState, useEffect } from 'react';
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Link as LinkIcon, 
  Copy, 
  MousePointer, 
  ShoppingCart, 
  DollarSign,
  TrendingUp,
  LogOut,
  ExternalLink,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { createPageUrl } from "@/utils";

export default function AffiliateDashboard() {
  const [affiliateSession, setAffiliateSession] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');

  useEffect(() => {
    const session = localStorage.getItem('noorherbs_affiliate_session');
    if (!session) {
      window.location.href = createPageUrl("AffiliateLogin");
      return;
    }
    setAffiliateSession(JSON.parse(session));
  }, []);

  const { data: affiliate, isLoading: loadingAffiliate } = useQuery({
    queryKey: ['affiliate', affiliateSession?.id],
    queryFn: async () => {
      const affiliates = await base44.entities.Affiliate.filter({ id: affiliateSession.id });
      return affiliates[0];
    },
    enabled: !!affiliateSession?.id
  });

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: () => base44.entities.Product.list()
  });

  const { data: conversions = [] } = useQuery({
    queryKey: ['conversions', affiliateSession?.affiliate_id],
    queryFn: () => base44.entities.AffiliateConversion.filter({ affiliate_id: affiliateSession.affiliate_id }),
    enabled: !!affiliateSession?.affiliate_id
  });

  const { data: clicks = [] } = useQuery({
    queryKey: ['clicks', affiliateSession?.affiliate_id],
    queryFn: () => base44.entities.AffiliateClick.filter({ affiliate_id: affiliateSession.affiliate_id }),
    enabled: !!affiliateSession?.affiliate_id
  });

  const handleLogout = () => {
    localStorage.removeItem('noorherbs_affiliate_session');
    window.location.href = createPageUrl("AffiliateLogin");
  };

  const generateLink = (type, productId = '') => {
    const baseUrl = window.location.origin;
    let url = '';
    
    if (type === 'home') {
      url = `${baseUrl}?aff_id=${affiliate.affiliate_id}`;
    } else if (type === 'shop') {
      url = `${baseUrl}${createPageUrl("Shop")}?aff_id=${affiliate.affiliate_id}`;
    } else if (type === 'product' && productId) {
      url = `${baseUrl}${createPageUrl("ProductDetails")}?id=${productId}&aff_id=${affiliate.affiliate_id}`;
    }
    
    setGeneratedLink(url);
    return url;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  if (!affiliateSession || loadingAffiliate) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  const stats = [
    {
      title: "Total Clicks",
      value: affiliate?.total_clicks || clicks.length || 0,
      icon: MousePointer,
      color: "bg-blue-500"
    },
    {
      title: "Total Orders",
      value: affiliate?.total_orders || conversions.length || 0,
      icon: ShoppingCart,
      color: "bg-green-500"
    },
    {
      title: "Total Earnings",
      value: `₹${affiliate?.total_earnings || 0}`,
      icon: DollarSign,
      color: "bg-orange-500"
    },
    {
      title: "Conversion Rate",
      value: `${clicks.length > 0 ? ((conversions.length / clicks.length) * 100).toFixed(1) : 0}%`,
      icon: TrendingUp,
      color: "bg-purple-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Affiliate Dashboard</h1>
            <p className="text-gray-500">Welcome back, {affiliate?.name}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Link Generator */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="w-5 h-5" />
                Generate Affiliate Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">Your Affiliate ID</p>
                <div className="flex gap-2">
                  <Input value={affiliate?.affiliate_id} readOnly className="bg-gray-50" />
                  <Button variant="outline" onClick={() => copyToClipboard(affiliate?.affiliate_id)}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {affiliate?.coupon_code && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Your Coupon Code</p>
                  <div className="flex gap-2">
                    <Input value={affiliate.coupon_code} readOnly className="bg-orange-50 font-bold text-orange-600" />
                    <Button variant="outline" onClick={() => copyToClipboard(affiliate.coupon_code)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Gives {affiliate.coupon_discount_percent}% discount to customers</p>
                </div>
              )}

              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Quick Links</p>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-between"
                    onClick={() => {
                      const link = generateLink('home');
                      copyToClipboard(link);
                    }}
                  >
                    Homepage Link
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-between"
                    onClick={() => {
                      const link = generateLink('shop');
                      copyToClipboard(link);
                    }}
                  >
                    Shop Page Link
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Product Specific Link</p>
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map(product => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedProduct && (
                  <div className="mt-2 flex gap-2">
                    <Input 
                      value={generatedLink || generateLink('product', selectedProduct)} 
                      readOnly 
                      className="bg-gray-50 text-sm"
                    />
                    <Button variant="outline" onClick={() => copyToClipboard(generatedLink || generateLink('product', selectedProduct))}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Earnings Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Earnings Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-orange-50 rounded-xl">
                  <span className="text-gray-600">Pending Earnings</span>
                  <span className="text-xl font-bold text-orange-600">₹{affiliate?.pending_earnings || 0}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl">
                  <span className="text-gray-600">Paid Earnings</span>
                  <span className="text-xl font-bold text-green-600">₹{affiliate?.paid_earnings || 0}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-100 rounded-xl">
                  <span className="text-gray-600">Commission Rate</span>
                  <span className="text-xl font-bold text-gray-900">
                    {affiliate?.commission_type === 'fixed' ? `₹${affiliate?.commission_value}` : `${affiliate?.commission_value}%`}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Conversions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Conversions</CardTitle>
          </CardHeader>
          <CardContent>
            {conversions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No conversions yet. Share your affiliate link to start earning!</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Order #</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Order Total</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Commission</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Source</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {conversions.slice(0, 10).map(conversion => (
                      <tr key={conversion.id} className="border-b last:border-0">
                        <td className="py-3 px-4 font-medium">{conversion.order_number}</td>
                        <td className="py-3 px-4 text-gray-500">
                          {new Date(conversion.created_date).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">₹{conversion.order_total}</td>
                        <td className="py-3 px-4 font-medium text-green-600">₹{conversion.commission_amount}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            conversion.source === 'coupon' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {conversion.source === 'coupon' ? `Coupon: ${conversion.coupon_code_used}` : 'Link'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            conversion.status === 'paid' ? 'bg-green-100 text-green-700' :
                            conversion.status === 'approved' ? 'bg-blue-100 text-blue-700' :
                            conversion.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {conversion.status}
                          </span>
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
}