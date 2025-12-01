import React from 'react';
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import HeroBanner from "@/components/home/HeroBanner";
import CategoryBar from "@/components/home/CategoryBar";
import BestsellerSection from "@/components/home/BestsellerSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import FeaturedBanner from "@/components/home/FeaturedBanner";
import TestimonialSection from "@/components/home/TestimonialSection";
import { toast } from "sonner";

export default function Home() {
  const queryClient = useQueryClient();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => base44.entities.Product.list()
  });

  const addToCartMutation = useMutation({
    mutationFn: async (product) => {
      const user = await base44.auth.me();
      const existingItems = await base44.entities.CartItem.filter({ 
        product_id: product.id,
        created_by: user.email 
      });
      
      if (existingItems.length > 0) {
        return base44.entities.CartItem.update(existingItems[0].id, {
          quantity: (existingItems[0].quantity || 1) + 1
        });
      }
      
      return base44.entities.CartItem.create({
        product_id: product.id,
        product_name: product.name,
        product_image: product.image_url,
        price: product.price,
        quantity: 1
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success("Added to cart!");
    },
    onError: () => {
      toast.error("Please login to add items to cart");
    }
  });

  const handleAddToCart = (product) => {
    addToCartMutation.mutate(product);
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