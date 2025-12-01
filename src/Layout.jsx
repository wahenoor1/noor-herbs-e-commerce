import React, { useState, useEffect } from 'react';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";

export default function Layout({ children }) {
  const { data: cartItems = [] } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      try {
        const user = await base44.auth.me();
        if (user) {
          return base44.entities.CartItem.filter({ created_by: user.email });
        }
      } catch (e) {
        // Not logged in
      }
      return [];
    }
  });

  const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header cartCount={cartCount} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}