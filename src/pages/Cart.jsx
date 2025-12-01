import React from 'react';
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  Tag,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function Cart() {
  const queryClient = useQueryClient();

  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      try {
        const user = await base44.auth.me();
        if (user) {
          return base44.entities.CartItem.filter({ created_by: user.email });
        }
      } catch (e) {
        // Not logged in
      }
      return [];
    }
  });

  const updateQuantityMutation = useMutation({
    mutationFn: ({ id, quantity }) => {
      if (quantity < 1) return base44.entities.CartItem.delete(id);
      return base44.entities.CartItem.update(id, { quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  });

  const removeItemMutation = useMutation({
    mutationFn: (id) => base44.entities.CartItem.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success("Item removed from cart");
    }
  });

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal >= 500 ? 0 : 50;
  const total = subtotal + shipping;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

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
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="bg-white rounded-2xl p-4 md:p-6 flex flex-col md:flex-row gap-4"
                >
                  {/* Image */}
                  <div className="w-full md:w-32 h-32 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    <img 
                      src={item.product_image || "https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?w=200&h=200&fit=crop"} 
                      alt={item.product_name}
                      className="w-full h-full object-cover"
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
                        onClick={() => removeItemMutation.mutate(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-2"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border rounded-full">
                        <button 
                          onClick={() => updateQuantityMutation.mutate({ 
                            id: item.id, 
                            quantity: item.quantity - 1 
                          })}
                          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-l-full"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantityMutation.mutate({ 
                            id: item.id, 
                            quantity: item.quantity + 1 
                          })}
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