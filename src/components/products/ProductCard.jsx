import React from 'react';
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { motion } from "framer-motion";

export default function ProductCard({ product, onAddToCart }) {
  const discount = product.original_price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100) 
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group relative overflow-hidden rounded-2xl border-0 shadow-sm hover:shadow-xl transition-all duration-300 bg-white">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {product.is_bestseller && (
            <Badge className="bg-orange-500 text-white border-0 px-3 py-1">
              Bestseller
            </Badge>
          )}
          {product.is_new && (
            <Badge className="bg-green-500 text-white border-0 px-3 py-1">
              New
            </Badge>
          )}
          {discount > 0 && (
            <Badge className="bg-red-500 text-white border-0 px-3 py-1">
              {discount}% OFF
            </Badge>
          )}
        </div>
        
        {/* Wishlist Button */}
        <button className="absolute top-3 right-3 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50">
          <Heart className="w-5 h-5 text-gray-400 hover:text-red-500 transition-colors" />
        </button>
        
        {/* Image */}
        <Link to={createPageUrl(`ProductDetails?id=${product.id}`)}>
          <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-orange-50 to-amber-50">
            <img 
              src={product.image_url || "https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?w=400&h=400&fit=crop"} 
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?w=400&h=400&fit=crop"; }}
            />
          </div>
        </Link>
        
        {/* Content */}
        <div className="p-4">
          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-4 h-4 ${i < Math.floor(product.rating || 4.5) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`}
              />
            ))}
            <span className="text-sm text-gray-500 ml-1">
              ({product.reviews_count || 0})
            </span>
          </div>
          
          {/* Name */}
          <Link to={createPageUrl(`ProductDetails?id=${product.id}`)}>
            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 hover:text-orange-600 transition-colors">
              {product.name}
            </h3>
          </Link>
          
          {/* Description */}
          <p className="text-sm text-gray-500 mb-3 line-clamp-1">
            {product.description}
          </p>
          
          {/* Price & Add to Cart */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
              {product.original_price && (
                <span className="text-sm text-gray-400 line-through ml-2">₹{product.original_price}</span>
              )}
            </div>
            <Button 
              onClick={(e) => {
                e.preventDefault();
                onAddToCart?.(product);
              }}
              size="sm"
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-4"
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}