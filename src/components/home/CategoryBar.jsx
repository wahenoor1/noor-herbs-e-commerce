import React from 'react';
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { Heart, Zap, Sparkles, Scale, Activity, Users, Leaf, Sun } from "lucide-react";

const categories = [
  { name: "Immunity", slug: "immunity", icon: Shield, color: "bg-green-100 text-green-600" },
  { name: "Energy & Vitality", slug: "energy", icon: Zap, color: "bg-orange-100 text-orange-600" },
  { name: "Skin Care", slug: "skin_care", icon: Sparkles, color: "bg-pink-100 text-pink-600" },
  { name: "Weight Management", slug: "weight_management", icon: Scale, color: "bg-blue-100 text-blue-600" },
  { name: "Digestive Health", slug: "digestive_health", icon: Activity, color: "bg-amber-100 text-amber-600" },
  { name: "Men's Health", slug: "mens_health", icon: Users, color: "bg-indigo-100 text-indigo-600" },
  { name: "Women's Health", slug: "womens_health", icon: Heart, color: "bg-rose-100 text-rose-600" },
  { name: "General Wellness", slug: "general_wellness", icon: Sun, color: "bg-yellow-100 text-yellow-600" },
];

import { Shield } from "lucide-react";

export default function CategoryBar() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Shop by Concern</h2>
          <p className="text-gray-600">Find the perfect herbal solution for your wellness needs</p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link 
                  to={createPageUrl(`Shop?category=${category.slug}`)}
                  className="group flex flex-col items-center p-4 rounded-2xl hover:bg-gray-50 transition-all"
                >
                  <div className={`w-14 h-14 ${category.color} rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 text-center group-hover:text-orange-600 transition-colors">
                    {category.name}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}