import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  ShoppingCart, 
  Menu, 
  Phone, 
  Leaf,
  ChevronDown,
  Heart,
  Package
} from "lucide-react";


const categories = [
  { name: "Immunity", slug: "immunity" },
  { name: "Energy & Vitality", slug: "energy" },
  { name: "Skin Care", slug: "skin_care" },
  { name: "Weight Management", slug: "weight_management" },
  { name: "Digestive Health", slug: "digestive_health" },
  { name: "Men's Health", slug: "mens_health" },
  { name: "Women's Health", slug: "womens_health" },
];

export default function Header({ cartCount = 0 }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'}`}>
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <span>+91 70090 39292</span>
          </div>
          <p className="hidden md:block">Free Shipping on Orders Above ₹500</p>
          <Link to={createPageUrl("TrackOrder")} className="hover:underline flex items-center gap-1">
            <Package className="w-4 h-4" />
            Track Order
          </Link>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <div className="flex flex-col gap-6 mt-8">
                <Link to={createPageUrl("Home")} className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-green-600 rounded-xl flex items-center justify-center">
                    <Leaf className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xl font-bold text-gray-900">Noor Herbs</span>
                </Link>
                
                <nav className="flex flex-col gap-2">
                  <Link to={createPageUrl("Home")} className="py-2 px-3 hover:bg-orange-50 rounded-lg font-medium">Home</Link>
                  <Link to={createPageUrl("Shop")} className="py-2 px-3 hover:bg-orange-50 rounded-lg font-medium">All Products</Link>
                  {categories.map(cat => (
                    <Link 
                      key={cat.slug} 
                      to={createPageUrl(`Shop?category=${cat.slug}`)}
                      className="py-2 px-3 hover:bg-orange-50 rounded-lg text-gray-600"
                    >
                      {cat.name}
                    </Link>
                  ))}
                  <Link to={createPageUrl("About")} className="py-2 px-3 hover:bg-orange-50 rounded-lg font-medium">About Us</Link>
                  <Link to={createPageUrl("Contact")} className="py-2 px-3 hover:bg-orange-50 rounded-lg font-medium">Contact</Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link to={createPageUrl("Home")} className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-green-600 rounded-xl flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-gray-900">Noor Herbs</span>
              <p className="text-xs text-gray-500">Pure Herbal Wellness</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link to={createPageUrl("Home")} className="font-medium text-gray-700 hover:text-orange-600 transition-colors">
              Home
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 font-medium text-gray-700 hover:text-orange-600 transition-colors">
                Shop
                <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem asChild>
                  <Link to={createPageUrl("Shop")} className="w-full font-medium">All Products</Link>
                </DropdownMenuItem>
                {categories.map(cat => (
                  <DropdownMenuItem key={cat.slug} asChild>
                    <Link to={createPageUrl(`Shop?category=${cat.slug}`)} className="w-full">{cat.name}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link to={createPageUrl("About")} className="font-medium text-gray-700 hover:text-orange-600 transition-colors">
              About
            </Link>
            <Link to={createPageUrl("Contact")} className="font-medium text-gray-700 hover:text-orange-600 transition-colors">
              Contact
            </Link>
          </nav>

          {/* Search & Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Search */}
            <div className="hidden md:flex items-center relative">
              <Input 
                placeholder="Search products..." 
                className="w-48 lg:w-64 rounded-full bg-gray-50 border-gray-200 pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="w-5 h-5 text-gray-400 absolute right-3" />
            </div>
            
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSearchOpen(!searchOpen)}>
              <Search className="w-5 h-5" />
            </Button>

            {/* Wishlist */}
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Heart className="w-5 h-5" />
            </Button>

            {/* Contact */}
            <Link to={createPageUrl("Contact")}>
              <Button variant="ghost" size="icon">
                <Phone className="w-5 h-5" />
              </Button>
            </Link>

            {/* Cart */}
            <Link to={createPageUrl("Cart")}>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-orange-500 text-white text-xs">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Search */}
        {searchOpen && (
          <div className="md:hidden pb-4">
            <div className="relative">
              <Input 
                placeholder="Search products..." 
                className="w-full rounded-full bg-gray-50 border-gray-200 pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}