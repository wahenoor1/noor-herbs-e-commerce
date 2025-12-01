import React, { useState, useMemo } from 'react';
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ProductCard from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Search, SlidersHorizontal, X, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const categories = [
  { name: "All Products", slug: "all" },
  { name: "Immunity", slug: "immunity" },
  { name: "Energy & Vitality", slug: "energy" },
  { name: "Skin Care", slug: "skin_care" },
  { name: "Weight Management", slug: "weight_management" },
  { name: "Digestive Health", slug: "digestive_health" },
  { name: "Men's Health", slug: "mens_health" },
  { name: "Women's Health", slug: "womens_health" },
  { name: "General Wellness", slug: "general_wellness" },
];

export default function Shop() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialCategory = urlParams.get('category') || 'all';
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [sortBy, setSortBy] = useState("featured");
  const [showBestsellers, setShowBestsellers] = useState(false);
  
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

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (searchQuery) {
      result = result.filter(p => 
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Price filter
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Bestsellers filter
    if (showBestsellers) {
      result = result.filter(p => p.is_bestseller);
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
        break;
      default:
        // Featured - bestsellers first
        result.sort((a, b) => (b.is_bestseller ? 1 : 0) - (a.is_bestseller ? 1 : 0));
    }

    return result;
  }, [products, searchQuery, selectedCategory, priceRange, showBestsellers, sortBy]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setPriceRange([0, 5000]);
    setShowBestsellers(false);
  };

  const activeFiltersCount = [
    selectedCategory !== 'all',
    priceRange[0] > 0 || priceRange[1] < 5000,
    showBestsellers,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {selectedCategory !== 'all' 
              ? categories.find(c => c.slug === selectedCategory)?.name 
              : 'All Products'}
          </h1>
          <p className="text-white/90">
            Discover our range of premium herbal products
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input 
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 rounded-full bg-white"
            />
          </div>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48 h-12 rounded-full bg-white">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
            </SelectContent>
          </Select>

          {/* Mobile Filter Button */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" className="h-12 rounded-full relative">
                <SlidersHorizontal className="w-5 h-5 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-orange-500">{activeFiltersCount}</Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                {/* Categories */}
                <div>
                  <h3 className="font-semibold mb-3">Category</h3>
                  <div className="space-y-2">
                    {categories.map(cat => (
                      <button
                        key={cat.slug}
                        onClick={() => setSelectedCategory(cat.slug)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedCategory === cat.slug 
                            ? 'bg-orange-100 text-orange-700 font-medium' 
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="font-semibold mb-3">Price Range</h3>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    min={0}
                    max={5000}
                    step={100}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                </div>

                {/* Bestsellers */}
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="bestsellers-mobile" 
                    checked={showBestsellers}
                    onCheckedChange={setShowBestsellers}
                  />
                  <label htmlFor="bestsellers-mobile" className="text-sm font-medium">
                    Show only Bestsellers
                  </label>
                </div>

                <Button onClick={clearFilters} variant="outline" className="w-full">
                  Clear All Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg">Filters</h3>
                {activeFiltersCount > 0 && (
                  <button onClick={clearFilters} className="text-sm text-orange-600 hover:underline">
                    Clear all
                  </button>
                )}
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3 text-gray-700">Category</h4>
                <div className="space-y-1">
                  {categories.map(cat => (
                    <button
                      key={cat.slug}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === cat.slug 
                          ? 'bg-orange-100 text-orange-700 font-medium' 
                          : 'hover:bg-gray-100 text-gray-600'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3 text-gray-700">Price Range</h4>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  min={0}
                  max={5000}
                  step={100}
                  className="mb-3"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>₹{priceRange[0]}</span>
                  <span>₹{priceRange[1]}</span>
                </div>
              </div>

              {/* Bestsellers */}
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="bestsellers" 
                  checked={showBestsellers}
                  onCheckedChange={setShowBestsellers}
                />
                <label htmlFor="bestsellers" className="text-sm font-medium text-gray-700">
                  Bestsellers only
                </label>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Active Filters */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedCategory !== 'all' && (
                  <Badge variant="secondary" className="px-3 py-1 bg-orange-100 text-orange-700">
                    {categories.find(c => c.slug === selectedCategory)?.name}
                    <button onClick={() => setSelectedCategory('all')} className="ml-2">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {(priceRange[0] > 0 || priceRange[1] < 5000) && (
                  <Badge variant="secondary" className="px-3 py-1 bg-orange-100 text-orange-700">
                    ₹{priceRange[0]} - ₹{priceRange[1]}
                    <button onClick={() => setPriceRange([0, 5000])} className="ml-2">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {showBestsellers && (
                  <Badge variant="secondary" className="px-3 py-1 bg-orange-100 text-orange-700">
                    Bestsellers
                    <button onClick={() => setShowBestsellers(false)} className="ml-2">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
              </div>
            )}

            {/* Results Count */}
            <p className="text-gray-500 mb-6">
              Showing {filteredProducts.length} products
            </p>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl">
                <p className="text-gray-500 mb-4">No products found matching your criteria</p>
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ProductCard 
                      product={product} 
                      onAddToCart={() => addToCartMutation.mutate(product)} 
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}