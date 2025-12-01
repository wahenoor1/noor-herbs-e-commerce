import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

export default function FeaturedBanner() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative grid lg:grid-cols-2 gap-8 items-center p-8 md:p-12 lg:p-16">
            {/* Content */}
            <div className="text-white">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">King of Vitamin C</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                Sea Buckthorn Juice
              </h2>
              <p className="text-lg text-white/90 mb-8 max-w-md">
                Rich in Omega 3, 6, 7 & 9. Sourced directly from Ladakh's pristine valleys. 
                DRDO approved for its exceptional health benefits.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link to={createPageUrl("Shop?category=immunity")}>
                  <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 rounded-full px-8">
                    Shop Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
              
              {/* Stats */}
              <div className="flex gap-8 mt-10">
                <div>
                  <p className="text-3xl font-bold">1000+</p>
                  <p className="text-white/80 text-sm">Happy Customers</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">100%</p>
                  <p className="text-white/80 text-sm">Natural</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">5★</p>
                  <p className="text-white/80 text-sm">Rated</p>
                </div>
              </div>
            </div>
            
            {/* Image */}
            <div className="hidden lg:block">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692d8181feb1ac797ea503b0/b8bd1ca3f_WhatsAppImage2025-11-27at144623.jpg" 
                alt="Sea Buckthorn Juice"
                className="rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500 bg-white p-4"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}