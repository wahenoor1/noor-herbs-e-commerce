import React from 'react';
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Package, 
  Heart, 
  LogOut,
  ChevronRight,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";

export default function Account() {
  const { data: user, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        return await base44.auth.me();
      } catch (e) {
        return null;
      }
    }
  });

  const { data: orders = [] } = useQuery({
    queryKey: ['orders', user?.email],
    queryFn: async () => {
      if (!user) return [];
      return base44.entities.Order.filter({ created_by: user.email }, '-created_date', 10);
    },
    enabled: !!user
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-10 h-10 text-orange-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Please Login</h1>
          <p className="text-gray-500 mb-6">Login to view your account and orders</p>
          <Button 
            onClick={() => base44.auth.redirectToLogin()}
            className="bg-orange-500 hover:bg-orange-600 rounded-full px-8"
          >
            Login / Sign Up
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>

        {/* User Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user.full_name || 'User'}</h2>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl overflow-hidden mb-6"
        >
          <Link to={createPageUrl("Cart")} className="flex items-center justify-between p-4 hover:bg-gray-50 border-b">
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-gray-600" />
              <span className="font-medium">My Cart</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>
          <Link to="#" className="flex items-center justify-between p-4 hover:bg-gray-50 border-b">
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-gray-600" />
              <span className="font-medium">Wishlist</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>
          <button 
            onClick={() => base44.auth.logout()}
            className="flex items-center justify-between p-4 hover:bg-gray-50 w-full text-left text-red-600"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </div>
          </button>
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Orders</h2>
          
          {orders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No orders yet</p>
              <Link to={createPageUrl("Shop")}>
                <Button variant="outline" className="mt-4 rounded-full">
                  Start Shopping
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border rounded-xl p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-medium text-gray-900">Order #{order.order_number}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.created_date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'confirmed' ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">
                      {order.items?.length || 0} item(s)
                    </p>
                    <p className="font-bold text-gray-900">₹{order.total}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}