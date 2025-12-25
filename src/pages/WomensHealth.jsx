import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Sparkles, 
  Shield, 
  Calendar,
  CheckCircle2,
  ShoppingCart,
  Leaf,
  Star
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function WomensHealth() {
  const [selectedImage, setSelectedImage] = useState('front');

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('noorherbs_cart') || '[]');
    const product = {
      product_id: 'women-m8-sawras',
      product_name: 'WOMEN-M8 Sawras',
      product_image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692d8181feb1ac797ea503b0/b8f6bb542_2.png',
      price: 399,
      quantity: 1
    };

    const existingIndex = cart.findIndex(item => item.product_id === product.product_id);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push(product);
    }

    localStorage.setItem('noorherbs_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    toast.success("Added to cart!");
  };

  const benefits = [
    { icon: Calendar, title: "Menstrual Health", desc: "Regulates cycles and reduces discomfort" },
    { icon: Heart, title: "Hormonal Balance", desc: "Supports natural hormone regulation" },
    { icon: Sparkles, title: "Skin Health", desc: "Promotes radiant, healthy skin" },
    { icon: Shield, title: "Immunity Boost", desc: "Strengthens natural defenses" },
    { icon: Leaf, title: "Natural Formula", desc: "100% Ayurvedic ingredients" },
  ];

  const ingredients = [
    { name: "Ashoka", benefit: "Regulates menstrual cycles, supports uterine health" },
    { name: "Lodhra", benefit: "Enhances reproductive health, supports hormonal balance" },
    { name: "Shatavari", benefit: "Supports fertility, enhances lactation, boosts overall well-being" },
    { name: "Amla", benefit: "Rich in Vitamin C, supports hormonal balance" },
    { name: "Tulsi", benefit: "Regulates menstrual cycles, promotes skin health" },
    { name: "Giloy", benefit: "Boosts immunity, supports anti-inflammatory properties" },
    { name: "Punarnava", benefit: "Aids in detoxification, reduces water retention" },
    { name: "Haldi", benefit: "Rich in curcumin, reduces inflammation, alleviates menstrual pain" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-600 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block"
          >
            <Badge className="bg-white/20 text-white mb-4 px-4 py-1.5">
              <Sparkles className="w-4 h-4 mr-2" />
              Women's Wellness
            </Badge>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            WOMEN-M8 Sawras
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white/90 max-w-2xl mx-auto"
          >
            An Ayurvedic Proprietary Medicine for Complete Women's Health
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Product Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <img 
                src={selectedImage === 'front' 
                  ? "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692d8181feb1ac797ea503b0/b8f6bb542_2.png"
                  : "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692d8181feb1ac797ea503b0/53d402945_1.png"
                }
                alt="WOMEN-M8 Sawras"
                className="w-full h-auto object-contain"
              />
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setSelectedImage('front')}
                className={`w-24 h-24 rounded-xl overflow-hidden border-2 transition-all ${
                  selectedImage === 'front' ? 'border-pink-500 shadow-lg' : 'border-gray-200'
                }`}
              >
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692d8181feb1ac797ea503b0/b8f6bb542_2.png"
                  alt="Front"
                  className="w-full h-full object-contain p-2"
                />
              </button>
              <button
                onClick={() => setSelectedImage('back')}
                className={`w-24 h-24 rounded-xl overflow-hidden border-2 transition-all ${
                  selectedImage === 'back' ? 'border-pink-500 shadow-lg' : 'border-gray-200'
                }`}
              >
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692d8181feb1ac797ea503b0/53d402945_1.png"
                  alt="Back"
                  className="w-full h-full object-contain p-2"
                />
              </button>
            </div>
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-gray-600">5.0 (Premium Quality)</span>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-4">WOMEN-M8 Sawras</h2>
              <p className="text-gray-600 mb-6">
                An Ayurvedic Proprietary Medicine specially formulated for women's health and wellness. 
                Supports hormonal balance, menstrual health, and overall well-being.
              </p>

              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-4xl font-bold text-pink-600">₹399</span>
                <Badge className="bg-pink-100 text-pink-700">200ml</Badge>
                <Badge className="bg-green-100 text-green-700">In Stock</Badge>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span>Premium Quality Ingredients</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span>100% Natural & Safe</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span>Serving Size: 2 servings per day (15ml each)</span>
                </div>
              </div>

              <Button 
                onClick={handleAddToCart}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 h-14 rounded-full text-lg"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>

              <div className="mt-6 p-4 bg-pink-50 rounded-xl">
                <p className="text-sm text-gray-600">
                  <strong>Dosage:</strong> Take 15ml morning and 15ml evening before taking a meal or as directed by the Physician.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Key Benefits
          </h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-600">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Ingredients Section */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-3xl p-8 md:p-12 text-white mb-8">
            <h2 className="text-3xl font-bold mb-4">Natural Ingredients</h2>
            <p className="text-white/90 text-lg">
              A powerful blend of traditional Ayurvedic herbs, carefully selected for women's health
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {ingredients.map((ingredient, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Leaf className="w-5 h-5 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{ingredient.name}</h3>
                    <p className="text-sm text-gray-600">{ingredient.benefit}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-600 rounded-3xl p-12 text-center text-white"
        >
          <h2 className="text-3xl font-bold mb-4">
            Experience Natural Women's Wellness
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of women who trust WOMEN-M8 Sawras for their health and well-being
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleAddToCart}
              className="bg-white text-pink-600 hover:bg-gray-100 h-14 rounded-full px-8 text-lg"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Order Now
            </Button>
            <Link to={createPageUrl("Shop?category=womens_health")}>
              <Button 
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 h-14 rounded-full px-8 text-lg"
              >
                View All Women's Products
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}