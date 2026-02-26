import React, { useState, useEffect } from 'react';
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/products/ProductCard";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

function getBrowsingContext() {
  const history = JSON.parse(localStorage.getItem('noorherbs_browsing') || '[]');
  const cart = JSON.parse(localStorage.getItem('noorherbs_cart') || '[]');
  const orders = JSON.parse(localStorage.getItem('noorherbs_orders') || '[]');
  return { history, cart, orders };
}

export default function AIRecommendations({ currentProductId = null, title = "Recommended For You" }) {
  const [recommendedIds, setRecommendedIds] = useState([]);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiGenerated, setAiGenerated] = useState(false);

  const { data: allProducts = [] } = useQuery({
    queryKey: ['products-for-recommendations'],
    queryFn: () => base44.entities.Product.list(),
  });

  useEffect(() => {
    if (allProducts.length === 0) return;
    generateRecommendations();
  }, [allProducts, currentProductId]);

  const generateRecommendations = async () => {
    const { history, cart, orders } = getBrowsingContext();

    // Build context for AI
    const cartItems = cart.map(i => i.product_name).join(', ');
    const recentlyViewed = history.slice(-5).map(h => h.name).join(', ');
    const pastPurchases = orders.flatMap(o => o.items?.map(i => i.product_name) || []).join(', ');
    const availableProducts = allProducts
      .filter(p => p.id !== currentProductId)
      .map(p => `${p.id}|${p.name}|${p.category}|${p.price}`)
      .join('\n');

    const hasContext = cartItems || recentlyViewed || pastPurchases;

    if (!hasContext) {
      // No context: show bestsellers
      const bestsellers = allProducts
        .filter(p => p.is_bestseller && p.id !== currentProductId)
        .slice(0, 4)
        .map(p => p.id);
      setRecommendedIds(bestsellers);
      return;
    }

    setIsLoadingAI(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a product recommendation engine for Noor Herbs, an Ayurvedic herbal supplements brand.

User context:
- Cart items: ${cartItems || 'none'}
- Recently viewed: ${recentlyViewed || 'none'}
- Past purchases: ${pastPurchases || 'none'}

Available products (format: id|name|category|price):
${availableProducts}

Return exactly 4 product IDs from the list above that are most relevant to this user's interests. Only return IDs separated by commas, nothing else.`,
        response_json_schema: {
          type: "object",
          properties: {
            product_ids: { type: "array", items: { type: "string" } }
          }
        }
      });

      const ids = result?.product_ids || [];
      const validIds = ids.filter(id => allProducts.some(p => p.id === id)).slice(0, 4);
      setRecommendedIds(validIds.length > 0 ? validIds : allProducts.filter(p => p.is_bestseller && p.id !== currentProductId).slice(0, 4).map(p => p.id));
      setAiGenerated(true);
    } catch {
      // Fallback to bestsellers
      const fallback = allProducts.filter(p => p.is_bestseller && p.id !== currentProductId).slice(0, 4).map(p => p.id);
      setRecommendedIds(fallback);
    }
    setIsLoadingAI(false);
  };

  const handleAddToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('noorherbs_cart') || '[]');
    const existingIndex = cart.findIndex(item => item.product_id === product.id);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({ product_id: product.id, product_name: product.name, product_image: product.image_url, price: product.price, quantity: 1 });
    }
    localStorage.setItem('noorherbs_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    toast.success("Added to cart!");
  };

  const recommendedProducts = recommendedIds
    .map(id => allProducts.find(p => p.id === id))
    .filter(Boolean);

  if (isLoadingAI) {
    return (
      <div className="py-10 text-center">
        <Loader2 className="w-6 h-6 animate-spin text-orange-500 mx-auto mb-2" />
        <p className="text-sm text-gray-500">Finding the best picks for you...</p>
      </div>
    );
  }

  if (recommendedProducts.length === 0) return null;

  return (
    <div className="py-10">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-orange-500" />
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        {aiGenerated && (
          <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-medium">AI Powered</span>
        )}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendedProducts.map(product => (
          <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
        ))}
      </div>
    </div>
  );
}