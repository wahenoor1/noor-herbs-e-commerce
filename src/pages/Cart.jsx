import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Minus, 
  Plus, 
  Trash2, 
  ShoppingBag, 
  ArrowRight,
  Truck,
  Shield,
  Tag
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    loadCart();
    window.addEventListener('cartUpdated', loadCart);
    return () => window.removeEventListener('cartUpdated', loadCart);
  }, []);

  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem('noorherbs_cart') || '[]');
    setCartItems(cart);
  };

  const updateQuantity = (index, newQuantity) => {
    const cart = [...cartItems];
    if (newQuantity < 1) {
      cart.splice(index, 1);
      toast.success("Item removed from cart");
    } else {
      cart[index].quantity = newQuantity;
    }
    localStorage.setItem('noorherbs_cart', JSON.stringify(cart));
    setCartItems(cart);
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const removeItem = (index) => {
    const cart = [...cartItems];
    cart.splice(index, 1);
    localStorage.setItem('noorherbs_cart', JSON.stringify(cart));
    setCartItems(cart);
    window.dispatchEvent(new Event('cartUpdated'));
    toast.success("Item removed from cart");
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal >= 500 ? 0 : 50;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-orange-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
          <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet</p>
          <Link to={createPageUrl("Shop")}>
            <Button className="bg-orange-500 hover:bg-orange-600 rounded-full px-8">
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.product_id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="bg-white rounded-2xl p-4 md:p-6 flex flex-col md:flex-row gap-4"
                >
                  {/* Image */}
                  <div className="w-full md:w-32 h-32 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    <img 
                      src={item.product_image || "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692d8181feb1ac797ea503b0/b8bd1ca3f_WhatsAppImage2025-11-27at144623.jpg"} 
                      alt={item.product_name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link to={createPageUrl(`ProductDetails?id=${item.product_id}`)}>
                          <h3 className="font-semibold text-gray-900 hover:text-orange-600 transition-colors">
                            {item.product_name}
                          </h3>
                        </Link>
                        <p className="text-lg font-bold text-gray-900 mt-1">₹{item.price}</p>
                      </div>
                      <button 
                        onClick={() => removeItem(index)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-2"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border rounded-full">
                        <button 
                          onClick={() => updateQuantity(index, item.quantity - 1)}
                          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-l-full"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(index, item.quantity + 1)}
                          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-r-full"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="font-bold text-gray-900">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              {/* Coupon */}
              <div className="flex gap-2 mb-6">
                <Input placeholder="Coupon code" className="rounded-full" />
                <Button variant="outline" className="rounded-full px-6">
                  Apply
                </Button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                </div>
                {shipping === 0 && (
                  <div className="flex items-center gap-2 text-green-600 text-sm">
                    <Tag className="w-4 h-4" />
                    Free shipping applied!
                  </div>
                )}
                {shipping > 0 && (
                  <div className="flex items-center gap-2 text-orange-600 text-sm">
                    <Truck className="w-4 h-4" />
                    Add ₹{500 - subtotal} more for free shipping
                  </div>
                )}
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>
              </div>

              <Link to={createPageUrl("Checkout")}>
                <Button className="w-full bg-orange-500 hover:bg-orange-600 h-14 rounded-full text-lg">
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-4 mt-6 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  Secure Checkout
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}