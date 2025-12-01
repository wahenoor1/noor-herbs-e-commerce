import React from 'react';
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import { motion } from "framer-motion";

export default function BestsellerSection({ products, onAddToCart }) {
  const bestsellers = products?.filter(p => p.is_bestseller).slice(0, 4) || [];
  
  if (bestsellers.length === 0 && products?.length > 0) {
    bestsellers.push(...products.slice(0, 4));
  }

  return (
    <section className="py-16 bg-gradient-to-b from-white to-orange-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-orange-600 font-medium text-sm uppercase tracking-wider"
            >
              Top Picks
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mt-2"
            >
              Bestseller Products
            </motion.h2>
          </div>
          <Link to={createPageUrl("Shop")}>
            <Button variant="ghost" className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 mt-4 md:mt-0">
              View All Products
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestsellers.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCard product={product} onAddToCart={onAddToCart} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}