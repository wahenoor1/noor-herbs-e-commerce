import React, { useState } from 'react';
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Package, 
  Search, 
  CheckCircle2, 
  Truck, 
  Home,
  Clock,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function TrackOrder() {
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!orderNumber.trim()) {
      toast.error("Please enter an order number");
      return;
    }

    setIsLoading(true);
    setSearched(true);

    try {
      const orders = await base44.entities.Order.filter({ order_number: orderNumber.trim() });
      if (orders.length > 0) {
        setOrder(orders[0]);
      } else {
        setOrder(null);
      }
    } catch (e) {
      toast.error("Error searching for order");
    }

    setIsLoading(false);
  };

  const getStatusStep = (status) => {
    switch (status) {
      case 'pending': return 1;
      case 'confirmed': return 2;
      case 'shipped': return 3;
      case 'delivered': return 4;
      default: return 1;
    }
  };

  const statuses = [
    { key: 'pending', label: 'Order Placed', icon: Package },
    { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
    { key: 'shipped', label: 'Shipped', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: Home },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Order</h1>
          <p className="text-gray-500">Enter your order number to track shipment</p>
        </motion.div>

        {/* Search Form */}
        <motion.form 
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-lg mb-8"
        >
          <div className="flex gap-3">
            <Input 
              placeholder="Enter Order Number (e.g., NH12345678)"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="flex-1 h-12"
            />
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-orange-500 hover:bg-orange-600 h-12 px-6"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Track
                </>
              )}
            </Button>
          </div>
        </motion.form>

        {/* Order Details */}
        {searched && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {order ? (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-gray-500">Order Number</p>
                    <p className="text-xl font-bold text-gray-900">{order.order_number}</p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'confirmed' ? 'bg-orange-100 text-orange-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                  </span>
                </div>

                {/* Status Timeline */}
                <div className="relative mb-8">
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />
                  <div className="space-y-6">
                    {statuses.map((status, index) => {
                      const step = getStatusStep(order.status);
                      const isCompleted = index < step;
                      const isCurrent = index === step - 1;
                      const Icon = status.icon;

                      return (
                        <div key={status.key} className="relative flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 ${
                            isCompleted || isCurrent 
                              ? 'bg-orange-500 text-white' 
                              : 'bg-gray-100 text-gray-400'
                          }`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className={`font-medium ${isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-400'}`}>
                              {status.label}
                            </p>
                            {isCurrent && (
                              <p className="text-sm text-orange-600">Current Status</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Order Info */}
                <div className="border-t pt-6">
                  <h3 className="font-bold text-gray-900 mb-4">Order Details</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Order Date</span>
                      <span className="text-gray-900">
                        {new Date(order.created_date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Total Amount</span>
                      <span className="font-bold text-gray-900">₹{order.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Payment Method</span>
                      <span className="text-gray-900">
                        {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Prepaid'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Shipping Address</span>
                      <span className="text-gray-900 text-right max-w-[200px]">
                        {order.city}, {order.pincode}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Order Not Found</h3>
                <p className="text-gray-500">
                  We couldn't find an order with number "{orderNumber}". Please check and try again.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}