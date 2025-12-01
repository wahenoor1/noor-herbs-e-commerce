import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf, Shield, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";

export default function HeroBanner() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-green-50">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-20 w-96 h-96 bg-green-200/30 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10"
          >
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full mb-6 shadow-sm">
              <Leaf className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-700">100% Natural & Ayurvedic</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Pure Wellness from
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-green-600"> Ladakh's Treasures</span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 max-w-xl leading-relaxed">
              Discover the power of Sea Buckthorn - the King of Vitamin C. 
              Premium herbal products sourced directly from the pristine valleys of Ladakh.
            </p>
            
            <div className="flex flex-wrap gap-4 mb-10">
              <Link to={createPageUrl("Shop")}>
                <Button size="lg" className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all">
                  Shop Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to={createPageUrl("About")}>
                <Button variant="outline" size="lg" className="px-8 py-6 text-lg rounded-full border-2 border-gray-300 hover:border-orange-400 hover:text-orange-600">
                  Learn More
                </Button>
              </Link>
            </div>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">FSSAI Approved</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Award className="w-5 h-5 text-orange-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Lab Tested</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-amber-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">GMP Certified</span>
              </div>
            </div>
          </motion.div>
          
          {/* Right Image */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=700&fit=crop" 
                alt="Natural Herbal Products"
                className="w-full h-[400px] md:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              
              {/* Floating Card */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Featured Product</p>
                    <p className="font-bold text-gray-900">Sea Buckthorn Juice</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 line-through">₹599</p>
                    <p className="font-bold text-orange-600 text-xl">₹499</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}