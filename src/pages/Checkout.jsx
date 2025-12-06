import React, { useState, useEffect } from 'react';
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  CreditCard, 
  Truck, 
  Shield,
  Loader2,
  CheckCircle2,
  ChevronLeft,
  Tag
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { getAffiliateFromCookie, getAffiliateFromCoupon, calculateCommission } from "@/components/affiliate/AffiliateTracker";

export default function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: '',
    city: '',
    state: '',
    pincode: '',
    payment_method: 'cod'
  });

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('noorherbs_cart') || '[]');
    setCartItems(cart);
  }, []);

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsApplyingCoupon(true);
    
    const affiliate = await getAffiliateFromCoupon(couponCode.trim());
    if (affiliate) {
      setAppliedCoupon(affiliate);
      const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const discount = (subtotal * (affiliate.coupon_discount_percent || 10)) / 100;
      setCouponDiscount(discount);
      toast.success(`Coupon applied! ${affiliate.coupon_discount_percent}% discount`);
    } else {
      toast.error("Invalid coupon code");
    }
    setIsApplyingCoupon(false);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponCode('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Enhanced validation with specific error messages
    if (!formData.customer_name.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    if (!formData.customer_phone.trim()) {
      toast.error("Please enter your phone number");
      return;
    }
    if (!formData.shipping_address.trim()) {
      toast.error("Please enter your shipping address");
      return;
    }
    if (!formData.city.trim()) {
      toast.error("Please enter your city");
      return;
    }
    if (!formData.pincode.trim()) {
      toast.error("Please enter your pincode");
      return;
    }

    setIsSubmitting(true);

    try {
      const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const shipping = subtotal >= 500 ? 0 : 50;
      const finalTotal = subtotal - couponDiscount + shipping;
      const orderNumber = `NH${Date.now().toString().slice(-8)}`;
      
      // Create order
      const order = await base44.entities.Order.create({
        order_number: orderNumber,
        ...formData,
        items: cartItems.map(item => ({
          product_id: item.product_id,
          product_name: item.product_name,
          quantity: item.quantity,
          price: item.price
        })),
        subtotal,
        shipping_cost: shipping,
        total: finalTotal,
        status: 'pending'
      });

      // Track affiliate conversion
      let affiliateSource = null;
      let trackingAffiliate = appliedCoupon; // Coupon affiliate takes priority
      
      if (!trackingAffiliate) {
        // Check for cookie-based affiliate
        const affIdFromCookie = getAffiliateFromCookie();
        if (affIdFromCookie) {
          const affiliates = await base44.entities.Affiliate.filter({ affiliate_id: affIdFromCookie, status: 'approved' });
          if (affiliates.length > 0) {
            trackingAffiliate = affiliates[0];
            affiliateSource = 'link';
          }
        }
      } else {
        affiliateSource = 'coupon';
      }

      // Record affiliate conversion
      if (trackingAffiliate) {
        const commission = calculateCommission(trackingAffiliate, finalTotal);
        
        await base44.entities.AffiliateConversion.create({
          affiliate_id: trackingAffiliate.affiliate_id,
          order_id: order.id,
          order_number: orderNumber,
          order_total: finalTotal,
          commission_amount: commission,
          status: 'pending',
          source: affiliateSource,
          coupon_code_used: affiliateSource === 'coupon' ? trackingAffiliate.coupon_code : ''
        });

        // Update affiliate stats
        await base44.entities.Affiliate.update(trackingAffiliate.id, {
          total_orders: (trackingAffiliate.total_orders || 0) + 1,
          total_earnings: (trackingAffiliate.total_earnings || 0) + commission,
          pending_earnings: (trackingAffiliate.pending_earnings || 0) + commission
        });
      }

      // Prepare email content
      const itemsList = cartItems.map(item => `${item.product_name} x ${item.quantity} - ₹${item.price * item.quantity}`).join('\n');
      
      // Send email to store admin
      await base44.integrations.Core.SendEmail({
        to: "noorherbs2025@gmail.com",
        subject: `🎉 New Order Received - ${orderNumber}`,
        body: `New order received!\n\nOrder Number: ${orderNumber}\n\nCustomer Details:\nName: ${formData.customer_name}\nPhone: ${formData.customer_phone}\nEmail: ${formData.customer_email || 'Not provided'}\n\nShipping Address:\n${formData.shipping_address}\n${formData.city}, ${formData.state}\nPincode: ${formData.pincode}\n\nOrder Items:\n${itemsList}\n\nSubtotal: ₹${subtotal}${couponDiscount > 0 ? `\nCoupon Discount: -₹${couponDiscount}` : ''}\nShipping: ${shipping === 0 ? 'Free' : '₹' + shipping}\nTotal: ₹${finalTotal}\n\nPayment Method: ${formData.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}${trackingAffiliate ? `\n\nAffiliate: ${trackingAffiliate.name} (${trackingAffiliate.affiliate_id})` : ''}`
      });

      // Send confirmation email to customer if email provided
      if (formData.customer_email && formData.customer_email.trim()) {
        await base44.integrations.Core.SendEmail({
          to: formData.customer_email,
          subject: `Order Confirmation - ${orderNumber} - Noor Herbs`,
          body: `Dear ${formData.customer_name},\n\nThank you for your order!\n\nOrder Number: ${orderNumber}\n\nOrder Summary:\n${itemsList}\n\nSubtotal: ₹${subtotal}${couponDiscount > 0 ? `\nDiscount: -₹${couponDiscount}` : ''}\nShipping: ${shipping === 0 ? 'Free' : '₹' + shipping}\nTotal Amount: ₹${finalTotal}\n\nShipping Address:\n${formData.shipping_address}\n${formData.city}, ${formData.state}\nPincode: ${formData.pincode}\n\nPayment Method: ${formData.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}\n\nWe will process your order shortly and send you tracking details once shipped.\n\nFor any queries, contact us at:\nPhone: +91-XXXXXXXXXX\nEmail: noorherbs2025@gmail.com\n\nThank you for choosing Noor Herbs!\n\nBest regards,\nNoor Herbs Team`
        });
      }

      // Clear cart
      localStorage.setItem('noorherbs_cart', JSON.stringify([]));
      window.dispatchEvent(new Event('cartUpdated'));

      // Show success message
      toast.success("🎉 Order placed successfully!");
      
      // Redirect to confirmation page
      setTimeout(() => {
        window.location.href = createPageUrl(`OrderConfirmation?order=${orderNumber}`);
      }, 1000);
      
    } catch (error) {
      console.error("Order creation error:", error);
      toast.error("Failed to place order. Please try again or contact support.");
      setIsSubmitting(false);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal >= 500 ? 0 : 50;
  const total = subtotal - couponDiscount + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">No items in cart</h1>
          <p className="text-gray-500 mb-6">Please add items to your cart first</p>
          <Link to={createPageUrl("Shop")}>
            <Button className="bg-orange-500 hover:bg-orange-600 rounded-full px-8">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to={createPageUrl("Cart")} className="inline-flex items-center text-gray-500 hover:text-orange-600 mb-6">
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Cart
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Shipping Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Info */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input 
                      id="name"
                      value={formData.customer_name}
                      onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                      className="mt-1"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email"
                      type="email"
                      value={formData.customer_email}
                      onChange={(e) => setFormData({...formData, customer_email: e.target.value})}
                      className="mt-1"
                      placeholder="your@email.com"
                    />
                    <p className="text-xs text-gray-500 mt-1">Optional - for order confirmation email</p>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input 
                      id="phone"
                      value={formData.customer_phone}
                      onChange={(e) => setFormData({...formData, customer_phone: e.target.value})}
                      className="mt-1"
                      placeholder="+91 XXXXXXXXXX"
                      required
                    />
                  </div>
                </div>
              </motion.div>

              {/* Shipping Address */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Address</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="address">Complete Address *</Label>
                    <Textarea 
                      id="address"
                      value={formData.shipping_address}
                      onChange={(e) => setFormData({...formData, shipping_address: e.target.value})}
                      className="mt-1"
                      rows={3}
                      placeholder="House/Flat No., Street, Area"
                      required
                    />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input 
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        className="mt-1"
                        placeholder="City"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input 
                        id="state"
                        value={formData.state}
                        onChange={(e) => setFormData({...formData, state: e.target.value})}
                        className="mt-1"
                        placeholder="State"
                      />
                    </div>
                    <div>
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input 
                        id="pincode"
                        value={formData.pincode}
                        onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                        className="mt-1"
                        placeholder="000000"
                        required
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Payment Method */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>
                <RadioGroup 
                  value={formData.payment_method} 
                  onValueChange={(value) => setFormData({...formData, payment_method: value})}
                >
                  <div className={`flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer ${formData.payment_method === 'cod' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}>
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex items-center gap-3 cursor-pointer flex-1">
                      <Truck className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-medium">Cash on Delivery</p>
                        <p className="text-sm text-gray-500">Pay when you receive</p>
                      </div>
                    </Label>
                  </div>
                  <div className={`flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer mt-3 ${formData.payment_method === 'prepaid' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}>
                    <RadioGroupItem value="prepaid" id="prepaid" />
                    <Label htmlFor="prepaid" className="flex items-center gap-3 cursor-pointer flex-1">
                      <CreditCard className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-medium">Pay Online</p>
                        <p className="text-sm text-gray-500">UPI, Card, Net Banking</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </motion.div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                {/* Coupon Code */}
                <div className="mb-6">
                  {!appliedCoupon ? (
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Coupon code" 
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className="rounded-full"
                      />
                      <Button 
                        type="button"
                        variant="outline" 
                        className="rounded-full px-6"
                        onClick={applyCoupon}
                        disabled={isApplyingCoupon}
                      >
                        {isApplyingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-green-50 p-3 rounded-xl">
                      <div className="flex items-center gap-2 text-green-700">
                        <Tag className="w-4 h-4" />
                        <span className="font-medium">{appliedCoupon.coupon_code}</span>
                        <span className="text-sm">(-{appliedCoupon.coupon_discount_percent}%)</span>
                      </div>
                      <button 
                        type="button"
                        onClick={removeCoupon}
                        className="text-red-500 text-sm hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* Items */}
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.product_id} className="flex gap-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img 
                          src={item.product_image || "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692d8181feb1ac797ea503b0/b8bd1ca3f_WhatsAppImage2025-11-27at144623.jpg"} 
                          alt={item.product_name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{item.product_name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium text-gray-900">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Coupon Discount</span>
                      <span>-₹{couponDiscount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span>₹{total}</span>
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-orange-500 hover:bg-orange-600 h-14 rounded-full text-lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      Place Order
                    </>
                  )}
                </Button>

                <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500">
                  <Shield className="w-4 h-4" />
                  Secure & Safe Checkout
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}