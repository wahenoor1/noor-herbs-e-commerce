import React, { useState, useEffect } from 'react';
import { base44 } from "@/api/base44Client";
import { Link, useLocation } from "react-router-dom";
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
  const location = useLocation();
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
    
    // Check if coupon was applied from Cart page
    const urlParams = new URLSearchParams(location.search);
    const appliedCouponData = urlParams.get('coupon');
    if (appliedCouponData) {
      try {
        const couponInfo = JSON.parse(decodeURIComponent(appliedCouponData));
        setAppliedCoupon(couponInfo.affiliate);
        setCouponDiscount(couponInfo.discount);
        setCouponCode(couponInfo.affiliate.coupon_code);
      } catch (e) {
        console.error('Error parsing coupon data:', e);
      }
    }
  }, [location]);

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsApplyingCoupon(true);
    
    try {
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
    } catch (error) {
      console.error("Coupon error:", error);
      toast.error("Failed to apply coupon");
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
      let trackingAffiliate = appliedCoupon;
      
      if (!trackingAffiliate) {
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

        await base44.entities.Affiliate.update(trackingAffiliate.id, {
          total_orders: (trackingAffiliate.total_orders || 0) + 1,
          total_earnings: (trackingAffiliate.total_earnings || 0) + commission,
          pending_earnings: (trackingAffiliate.pending_earnings || 0) + commission
        });
      }

      const itemsList = cartItems.map(item => `${item.product_name} x ${item.quantity} - ₹${item.price * item.quantity}`).join('\n');
      
      // Format order items for email
      const formattedItems = cartItems.map((item, idx) => 
        `${idx + 1}. ${item.product_name}\n   Quantity: ${item.quantity}\n   Price: ₹${item.price}\n   Subtotal: ₹${item.price * item.quantity}`
      ).join('\n\n');

      // Send email to admin
      base44.integrations.Core.SendEmail({
        to: "wahenoorenterprises@gmail.com",
        subject: `🎉 New Order Received - ${orderNumber}`,
        body: `══════════════════════════════════
🛍️ NEW ORDER RECEIVED
══════════════════════════════════

📋 ORDER DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Order Number: ${orderNumber}
Order Date: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}

👤 CUSTOMER INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${formData.customer_name}
Phone: ${formData.customer_phone}
Email: ${formData.customer_email || 'Not provided'}

📦 SHIPPING ADDRESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${formData.shipping_address}
${formData.city}, ${formData.state}
Pincode: ${formData.pincode}

🛒 ORDER ITEMS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${formattedItems}

💰 PAYMENT SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Subtotal:        ₹${subtotal}${couponDiscount > 0 ? `\nCoupon Discount: -₹${couponDiscount}` : ''}
Shipping:        ${shipping === 0 ? 'Free' : '₹' + shipping}
───────────────────────────────────
TOTAL:           ₹${finalTotal}

💳 PAYMENT METHOD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${formData.payment_method === 'cod' ? '💵 Cash on Delivery (COD)' : '💳 Online Payment'}${trackingAffiliate ? `

🤝 AFFILIATE REFERRAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Affiliate Name: ${trackingAffiliate.name}
Affiliate ID: ${trackingAffiliate.affiliate_id}
Source: ${affiliateSource === 'coupon' ? `Coupon Code (${trackingAffiliate.coupon_code})` : 'Referral Link'}` : ''}

══════════════════════════════════
Please process this order at your earliest convenience.

Best regards,
Noor Herbs Automated System`
      }).catch(() => {});

      // Send email to customer (with CC to admin)
      if (formData.customer_email && formData.customer_email.trim()) {
        const customerItemsList = cartItems.map((item, idx) => 
          `${idx + 1}. ${item.product_name}\n   Quantity: ${item.quantity} | Price: ₹${item.price} each\n   Subtotal: ₹${item.price * item.quantity}`
        ).join('\n\n');

        base44.integrations.Core.SendEmail({
          to: formData.customer_email,
          subject: `Order Confirmation - ${orderNumber} - Noor Herbs`,
          body: `Dear ${formData.customer_name},

Thank you for your order with Noor Herbs! 🌿

══════════════════════════════════
✅ ORDER CONFIRMED
══════════════════════════════════

Order Number: ${orderNumber}
Order Date: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}

📦 YOUR ORDER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${customerItemsList}

💰 ORDER SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Subtotal:        ₹${subtotal}${couponDiscount > 0 ? `\nDiscount:        -₹${couponDiscount.toFixed(2)}` : ''}
Delivery:        ${shipping === 0 ? 'FREE ✓' : '₹' + shipping}
───────────────────────────────────
TOTAL:           ₹${finalTotal.toFixed(2)}

📍 DELIVERY ADDRESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${formData.customer_name}
${formData.shipping_address}
${formData.city}, ${formData.state}
Pincode: ${formData.pincode}
Phone: ${formData.customer_phone}

💳 PAYMENT METHOD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${formData.payment_method === 'cod' ? '💵 Cash on Delivery (COD)' : '💳 Online Payment'}

📱 WHAT'S NEXT?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Your order is being processed
✓ You'll receive tracking details once shipped
✓ Expected delivery: 3-5 business days

📞 NEED HELP?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Phone: +91-9469668833
Email: wahenoorenterprises@gmail.com

══════════════════════════════════
Thank you for choosing Noor Herbs!

Best regards,
Noor Herbs Team`
        }).catch(() => {});
        
        // Send CC to admin
        base44.integrations.Core.SendEmail({
          to: "wahenoorenterprises@gmail.com",
          subject: `📧 CC: Customer Order Confirmation - ${orderNumber}`,
          body: `This is a copy of the order confirmation sent to customer.

CUSTOMER: ${formData.customer_name} (${formData.customer_email})
ORDER: ${orderNumber}
TOTAL: ₹${finalTotal}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dear ${formData.customer_name},

Thank you for your order with Noor Herbs! 🌿

══════════════════════════════════
✅ ORDER CONFIRMED
══════════════════════════════════

Order Number: ${orderNumber}
Order Date: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}

📦 YOUR ORDER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${customerItemsList}

💰 ORDER SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Subtotal:        ₹${subtotal}${couponDiscount > 0 ? `\nDiscount:        -₹${couponDiscount.toFixed(2)}` : ''}
Delivery:        ${shipping === 0 ? 'FREE ✓' : '₹' + shipping}
───────────────────────────────────
TOTAL:           ₹${finalTotal.toFixed(2)}

📍 DELIVERY ADDRESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${formData.customer_name}
${formData.shipping_address}
${formData.city}, ${formData.state}
Pincode: ${formData.pincode}
Phone: ${formData.customer_phone}

💳 PAYMENT METHOD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${formData.payment_method === 'cod' ? '💵 Cash on Delivery (COD)' : '💳 Online Payment'}`
        }).catch(() => {});
      }

      localStorage.setItem('noorherbs_cart', JSON.stringify([]));
      window.dispatchEvent(new Event('cartUpdated'));

      toast.success("🎉 Order placed successfully!");
      
      setTimeout(() => {
        window.location.href = createPageUrl(`OrderConfirmation?order=${orderNumber}`);
      }, 800);
      
    } catch (error) {
      console.error("Order creation error:", error);
      toast.error(`Order failed: ${error.message || 'Please try again'}`);
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
            <div className="lg:col-span-2 space-y-6">
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

            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

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
                      <span>-₹{couponDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span>₹{total.toFixed(2)}</span>
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