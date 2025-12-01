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
  ChevronLeft
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customer_name || !formData.customer_phone || !formData.shipping_address || !formData.city || !formData.pincode) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const shipping = subtotal >= 500 ? 0 : 50;
      const orderNumber = `NH${Date.now().toString().slice(-8)}`;
      
      await base44.entities.Order.create({
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
        total: subtotal + shipping,
        status: 'pending'
      });

      // Clear cart
      localStorage.setItem('noorherbs_cart', JSON.stringify([]));
      window.dispatchEvent(new Event('cartUpdated'));

      toast.success("Order placed successfully!");
      window.location.href = createPageUrl(`OrderConfirmation?order=${orderNumber}`);
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
    }

    setIsSubmitting(false);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal >= 500 ? 0 : 50;
  const total = subtotal + shipping;

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
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input 
                      id="phone"
                      value={formData.customer_phone}
                      onChange={(e) => setFormData({...formData, customer_phone: e.target.value})}
                      className="mt-1"
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
                      />
                    </div>
                    <div>
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input 
                        id="pincode"
                        value={formData.pincode}
                        onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                        className="mt-1"
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
                    <Loader2 className="w-5 h-5 animate-spin" />
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