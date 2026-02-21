import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

const PRODUCT_ID = '692d846e363964fa712ef3c8';
const PRODUCT_IMAGE = 'https://base44.app/api/apps/692d8181feb1ac797ea503b0/files/public/692d8181feb1ac797ea503b0/e0db1424f_Untitled.png';

export default function FeaturedBanner() {
  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('noorherbs_cart') || '[]');
    const existingIndex = cart.findIndex(item => item.product_id === PRODUCT_ID);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({
        product_id: PRODUCT_ID,
        product_name: 'Sea Buckthorn Juice',
        product_image: PRODUCT_IMAGE,
        price: 999,
        quantity: 1
      });
    }
    localStorage.setItem('noorherbs_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    toast.success("Sea Buckthorn Juice added to cart!");
  };

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
              <p className="text-lg text-white/90 mb-3 max-w-md">
                Rich in Omega 3, 6, 7 & 9. Sourced directly from Ladakh's pristine valleys. 
                DRDO approved for its exceptional health benefits.
              </p>
              <div className="flex items-center gap-3 mb-8">
                <span className="text-3xl font-bold">₹999</span>
                <span className="text-white/70 line-through text-xl">₹1,250</span>
                <span className="bg-white text-orange-600 px-3 py-1 rounded-full text-sm font-bold">20% OFF</span>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Link to={createPageUrl(`ProductDetails?id=${PRODUCT_ID}`)}>
                  <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 rounded-full px-8">
                    View Product
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  onClick={handleAddToCart}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white rounded-full px-8"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
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
            
            {/* Image - clickable to product page */}
            <Link to={createPageUrl(`ProductDetails?id=${PRODUCT_ID}`)} className="hidden lg:block">
              <img 
                src={PRODUCT_IMAGE}
                alt="Sea Buckthorn Juice"
                className="rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500 bg-white p-4 cursor-pointer"
              />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}