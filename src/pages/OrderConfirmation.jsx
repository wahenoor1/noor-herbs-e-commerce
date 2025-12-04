import React from 'react';
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  Package, 
  Truck, 
  Home,
  Phone,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";

export default function OrderConfirmation() {
  const urlParams = new URLSearchParams(window.location.search);
  const orderNumber = urlParams.get('order');

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderNumber],
    queryFn: async () => {
      const orders = await base44.entities.Order.filter({ order_number: orderNumber });
      return orders[0];
    },
    enabled: !!orderNumber
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-white rounded-3xl p-8 text-center mb-8"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Thank You for Your Order!</h1>
          <p className="text-gray-500 mb-2">Your order has been placed successfully.</p>
          <p className="text-gray-500 mb-6">We appreciate your trust in Noor Herbs. Our team will process your order and you'll receive updates via SMS.</p>
          
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-6 py-3 rounded-full font-medium">
            <Package className="w-5 h-5" />
            Order #{orderNumber}
          </div>
        </motion.div>

        {order && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-6 mb-8"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Details</h2>
            
            {/* Items */}
            <div className="space-y-4 mb-6">
              {order.items?.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{item.product_name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{order.shipping_cost === 0 ? 'Free' : `₹${order.shipping_cost}`}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                <span>Total</span>
                <span>₹{order.total}</span>
              </div>
            </div>
          </motion.div>
        )}

        {order && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl p-6 mb-8"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Shipping Address</h2>
            <div className="flex items-start gap-3 text-gray-600">
              <Home className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">{order.customer_name}</p>
                <p>{order.shipping_address}</p>
                <p>{order.city}, {order.state} - {order.pincode}</p>
                <p className="flex items-center gap-1 mt-2">
                  <Phone className="w-4 h-4" />
                  {order.customer_phone}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tracking Info */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-6 text-white mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-lg">Track Your Order</p>
              <p className="text-white/90">You will receive tracking details via SMS once shipped</p>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to={createPageUrl("Shop")}>
            <Button className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 rounded-full px-8">
              Continue Shopping
            </Button>
          </Link>
          <Link to={createPageUrl("Home")}>
            <Button variant="outline" className="w-full sm:w-auto rounded-full px-8">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}