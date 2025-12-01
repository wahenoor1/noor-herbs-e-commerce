import React, { useState } from 'react';
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Minus, 
  Plus, 
  Truck, 
  Shield, 
  RotateCcw,
  Check,
  Loader2,
  ChevronLeft
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import ProductCard from "@/components/products/ProductCard";

export default function ProductDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAdding, setIsAdding] = useState(false);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const products = await base44.entities.Product.filter({ id: productId });
      return products[0];
    },
    enabled: !!productId
  });

  const { data: relatedProducts = [] } = useQuery({
    queryKey: ['related-products', product?.category],
    queryFn: async () => {
      if (!product?.category) return [];
      const products = await base44.entities.Product.filter({ category: product.category });
      return products.filter(p => p.id !== productId).slice(0, 4);
    },
    enabled: !!product?.category
  });

  const handleAddToCart = () => {
    setIsAdding(true);
    const cart = JSON.parse(localStorage.getItem('noorherbs_cart') || '[]');
    const existingIndex = cart.findIndex(item => item.product_id === productId);
    
    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        product_id: productId,
        product_name: product.name,
        product_image: product.image_url,
        price: product.price,
        quantity: quantity
      });
    }
    
    localStorage.setItem('noorherbs_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    toast.success("Added to cart!");
    setIsAdding(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-gray-500 mb-4">Product not found</p>
        <Link to={createPageUrl("Shop")}>
          <Button>Back to Shop</Button>
        </Link>
      </div>
    );
  }

  const discount = product.original_price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100) 
    : 0;

  const images = [
    product.image_url || "https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?w=600&h=600&fit=crop"
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to={createPageUrl("Home")} className="hover:text-orange-600">Home</Link>
          <span>/</span>
          <Link to={createPageUrl("Shop")} className="hover:text-orange-600">Shop</Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-10 mb-12">
          <div className="grid lg:grid-cols-2 gap-10">
            {/* Images */}
            <div>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-orange-50 to-amber-50 mb-4"
              >
                <img 
                  src={images[selectedImage]} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.is_bestseller && (
                  <Badge className="absolute top-4 left-4 bg-orange-500 text-white">Bestseller</Badge>
                )}
                {discount > 0 && (
                  <Badge className="absolute top-4 right-4 bg-red-500 text-white">{discount}% OFF</Badge>
                )}
              </motion.div>
            </div>

            {/* Product Info */}
            <div>
              <Link to={createPageUrl("Shop")} className="inline-flex items-center text-gray-500 hover:text-orange-600 mb-4">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back to Shop
              </Link>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${i < Math.floor(product.rating || 4.5) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`}
                    />
                  ))}
                </div>
                <span className="text-gray-500">({product.reviews_count || 0} reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-4xl font-bold text-gray-900">₹{product.price}</span>
                {product.original_price && (
                  <span className="text-xl text-gray-400 line-through">₹{product.original_price}</span>
                )}
                {discount > 0 && (
                  <Badge className="bg-green-100 text-green-700">You save ₹{product.original_price - product.price}</Badge>
                )}
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

              {/* Benefits */}
              {product.benefits && product.benefits.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Key Benefits:</h3>
                  <ul className="space-y-2">
                    {product.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-600">
                        <Check className="w-5 h-5 text-green-500" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-6">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center border rounded-full">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-l-full"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-r-full"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 mb-8">
                <Button 
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white h-14 rounded-full text-lg"
                >
                  {isAdding ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Add to Cart
                    </>
                  )}
                </Button>
                <Button variant="outline" className="w-14 h-14 rounded-full">
                  <Heart className="w-5 h-5" />
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-2xl">
                <div className="text-center">
                  <Truck className="w-6 h-6 mx-auto text-orange-500 mb-1" />
                  <p className="text-xs text-gray-600">Free Shipping</p>
                </div>
                <div className="text-center">
                  <Shield className="w-6 h-6 mx-auto text-green-500 mb-1" />
                  <p className="text-xs text-gray-600">100% Genuine</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="w-6 h-6 mx-auto text-blue-500 mb-1" />
                  <p className="text-xs text-gray-600">Easy Returns</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-3xl p-6 md:p-10 mb-12">
          <Tabs defaultValue="description">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent mb-6">
              <TabsTrigger value="description" className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:bg-transparent px-6 py-3">
                Description
              </TabsTrigger>
              <TabsTrigger value="ingredients" className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:bg-transparent px-6 py-3">
                Ingredients
              </TabsTrigger>
              <TabsTrigger value="how-to-use" className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:bg-transparent px-6 py-3">
                How to Use
              </TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="text-gray-600 leading-relaxed">
              {product.detailed_description || product.description || "No detailed description available."}
            </TabsContent>
            <TabsContent value="ingredients" className="text-gray-600 leading-relaxed">
              {product.ingredients || "Pure natural herbal ingredients."}
            </TabsContent>
            <TabsContent value="how-to-use" className="text-gray-600 leading-relaxed">
              {product.how_to_use || "Follow the instructions on the product packaging or consult a healthcare professional."}
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} onAddToCart={() => {}} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}