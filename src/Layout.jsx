import React, { useState, useEffect } from 'react';


import { useLocation } from 'react-router-dom';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AffiliateTracker from "@/components/affiliate/AffiliateTracker";
import { Toaster } from "sonner";

// SEO Keywords for Noor Herbs - Ayurvedic & Nutraceutical Products
const SEO_KEYWORDS = "sea buckthorn juice, ayurvedic medicine, herbal supplements, nutraceuticals, immunity booster, anti-aging, cancer prevention, omega 3 6 9 7, vitamin C, ladakh herbs, natural wellness, organic supplements, herbal remedies, ayurveda, nutra products, health supplements, antioxidants, skin health, heart health, liver detox, weight management, digestive health, energy booster, natural immunity, DRDO approved, GMP certified, FSSAI approved, halal kosher certified";

export default function Layout({ children }) {
  const location = useLocation();

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname, location.search]);

  // Set SEO meta tags
  useEffect(() => {
    document.title = "Noor Herbs - Premium Ayurvedic & Herbal Products | Sea Buckthorn Juice from Ladakh";
    
    // Meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = "Noor Herbs offers premium Sea Buckthorn Juice from Ladakh - King of Vitamin C, rich in Omega 3, 6, 9 & rare Omega 7. Natural ayurvedic supplements for immunity, anti-aging, skin health & cancer prevention. DRDO approved, GMP certified.";
    
    // Meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.name = "keywords";
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.content = SEO_KEYWORDS;
    
    // Open Graph tags
    const ogTags = [
      { property: "og:title", content: "Noor Herbs - Premium Ayurvedic & Herbal Products" },
      { property: "og:description", content: "Premium Sea Buckthorn Juice from Ladakh. Natural ayurvedic supplements for immunity, anti-aging & wellness." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Noor Herbs" }
    ];
    
    ogTags.forEach(tag => {
      let meta = document.querySelector(`meta[property="${tag.property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', tag.property);
        document.head.appendChild(meta);
      }
      meta.content = tag.content;
    });
  }, []);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('noorherbs_cart') || '[]');
      const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
      setCartCount(count);
    };

    updateCartCount();
    window.addEventListener('cartUpdated', updateCartCount);
    return () => window.removeEventListener('cartUpdated', updateCartCount);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header cartCount={cartCount} />
      <AffiliateTracker />
              <main className="flex-1">
                {children}
              </main>
      <Footer />
      <Toaster richColors position="top-right" duration={4000} />
    </div>
  );
}