import React from 'react';
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import HeroBanner from "@/components/home/HeroBanner";
import CategoryBar from "@/components/home/CategoryBar";
import BestsellerSection from "@/components/home/BestsellerSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import FeaturedBanner from "@/components/home/FeaturedBanner";
import TestimonialSection from "@/components/home/TestimonialSection";
import { toast } from "sonner";

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
      <FeaturedBanner />
      <WhyChooseUs />
      <TestimonialSection />
    </div>
  );
}