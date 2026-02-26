import React from 'react';
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import HeroBanner from "@/components/home/HeroBanner";
import CategoryBar from "@/components/home/CategoryBar";
import BestsellerSection from "@/components/home/BestsellerSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";

import TestimonialSection from "@/components/home/TestimonialSection";
import VideoReviewsSection from "@/components/home/VideoReviewsSection";
import WhatsAppButton from "@/components/home/WhatsAppButton";
import { toast } from "sonner";
import AIRecommendations from "@/components/recommendations/AIRecommendations";

// SEO-optimized home page for Noor Herbs - Ayurvedic, Nutraceutical, Sea Buckthorn Products
// Keywords: sea buckthorn, ayurveda, nutra, herbal medicine, immunity booster, anti-aging, cancer prevention, omega fatty acids, vitamin c, ladakh

export default function Home() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => base44.entities.Product.list()
  });

  const handleAddToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('noorherbs_cart') || '[]');
    const existingIndex = cart.findIndex(item => item.product_id === product.id);
    
    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({
        product_id: product.id,
        product_name: product.name,
        product_image: product.image_url,
        price: product.price,
        quantity: 1
      });
    }
    
    localStorage.setItem('noorherbs_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    toast.success("Added to cart!");
  };

  return (
    <div>
      <HeroBanner />
      <CategoryBar />
      <BestsellerSection products={products} onAddToCart={handleAddToCart} />
      <VideoReviewsSection />
      <WhyChooseUs />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AIRecommendations title="Recommended For You" />
      </div>
      <TestimonialSection />
      <WhatsAppButton />
    </div>
  );
}