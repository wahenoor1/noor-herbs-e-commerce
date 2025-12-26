import React, { useState } from 'react';
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Leaf, 
  Heart, 
  Shield, 
  Sparkles, 
  Zap,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function SeaBuckthorn() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await base44.functions.invoke('sendEmail', {
        to: 'wahenoorenterprises@gmail.com',
        subject: `🌿 Sea Buckthorn Lead - ${formData.name}`,
        body: `New Lead from Sea Buckthorn Page
        
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Message: ${formData.message}

---
Noor Herbs Lead Capture System`,
        from_name: 'Noor Herbs - Sea Buckthorn'
      });

      setSubmitted(true);
      toast.success("Thank you! We'll contact you soon.");
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Form error:', error);
      toast.error("Failed to submit. Please try again.");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
              <Leaf className="w-5 h-5 text-white" />
              <span className="text-white font-medium">The Modern-Day Sanjeevani Booti</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Sea Buckthorn
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Nature's most powerful superfood from the Himalayas, packed with over 190 bioactive compounds
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* What is Sea Buckthorn */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 md:p-12 mb-12 shadow-lg"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">What is Sea Buckthorn?</h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            Sea buckthorn (Hippophae rhamnoides) is known as the modern-day <strong>"Sanjeevani Booti"</strong> (life-giving herb) in Ayurveda, referencing the mythical plant from the Ramayana, due to its exceptional nutrient density and vast health benefits.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            This remarkable plant contains high levels of vitamins (C, E, A), minerals, antioxidants, and rare Omega-7, making it a powerful superfood for immunity, skin, heart, and overall wellness, traditionally used in the Himalayas for healing and vitality.
          </p>
        </motion.div>

        {/* Why Sanjeevani Booti */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl p-8 md:p-12 mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Why It's Called Sanjeevani Booti</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Mythological Link</h3>
                <p className="text-gray-600">
                  Similar to the legendary herb used to revive Lakshman in the Ramayana, sea buckthorn is believed to possess unique, life-restoring properties.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Himalayan Origin</h3>
                <p className="text-gray-600">
                  It grows in harsh, high-altitude Himalayan regions, often called the "Cold Desert," adding to its mystical, potent reputation.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Nutritional Powerhouse */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-8 md:p-12 mb-12 shadow-lg"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Nutritional Powerhouse</h2>
          <p className="text-lg text-gray-600 mb-8">
            Sea buckthorn is packed with over <strong>190 bioactive compounds</strong>, including:
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6">
              <Zap className="w-8 h-8 text-orange-600 mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Vitamins</h3>
              <p className="text-sm text-gray-600">
                Rich in Vitamin C (more than oranges!), A, E, K, and B vitamins
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6">
              <Heart className="w-8 h-8 text-green-600 mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Omegas</h3>
              <p className="text-sm text-gray-600">
                A rare source of Omega-7, plus Omega-3, 6, and 9 fatty acids
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6">
              <Shield className="w-8 h-8 text-purple-600 mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Antioxidants</h3>
              <p className="text-sm text-gray-600">
                Flavonoids, carotenoids, polyphenols, and tocopherols
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
              <Sparkles className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Minerals & Amino Acids</h3>
              <p className="text-sm text-gray-600">
                Essential minerals and 18 amino acids
              </p>
            </div>
          </div>
        </motion.div>

        {/* Health Benefits */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 md:p-12 mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Health Benefits</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Boosts Immunity</h3>
                <p className="text-gray-600">Its high nutrient content supports a strong immune system</p>
              </div>
            </div>
            <div className="flex gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Skin Health</h3>
                <p className="text-gray-600">Promotes skin glow, hydration, and anti-aging, with oils used in skincare</p>
              </div>
            </div>
            <div className="flex gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Heart & Digestive Health</h3>
                <p className="text-gray-600">Supports cardiovascular function and digestion</p>
              </div>
            </div>
            <div className="flex gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Energy & Vitality</h3>
                <p className="text-gray-600">Helps increase energy levels and combat fatigue</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Video Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl p-8 md:p-12 mb-12 shadow-lg"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Watch & Learn More</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="aspect-video rounded-2xl overflow-hidden bg-gray-100">
              <iframe
                src="https://www.youtube.com/embed/WgHBy053BUU"
                title="Sea Buckthorn - Sanjeevani Booti"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="space-y-6">
              <div className="aspect-video rounded-2xl overflow-hidden bg-gray-100">
                <blockquote 
                  className="instagram-media" 
                  data-instgrm-permalink="https://www.instagram.com/reel/DNsx4Pr5Gd3/"
                  data-instgrm-version="14"
                  style={{ width: '100%', height: '100%' }}
                ></blockquote>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Lead Capture Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-3xl p-8 md:p-12 shadow-2xl"
        >
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Want to Know More?</h2>
              <p className="text-white/90">
                Get in touch with us to learn more about our Sea Buckthorn products and how they can benefit your health
              </p>
            </div>

            {submitted ? (
              <div className="bg-white rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
                <p className="text-gray-600 mb-6">We've received your inquiry and will contact you soon.</p>
                <Button 
                  onClick={() => setSubmitted(false)}
                  variant="outline"
                  className="rounded-full"
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 space-y-6">
                <div>
                  <Label htmlFor="name" className="text-gray-700">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="mt-2 h-12 rounded-full"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-gray-700">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="mt-2 h-12 rounded-full"
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-gray-700">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="mt-2 h-12 rounded-full"
                    placeholder="+91 XXXXXXXXXX"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="message" className="text-gray-700">Message</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="mt-2 rounded-2xl"
                    rows={4}
                    placeholder="Tell us what you'd like to know..."
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-full text-lg font-medium"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Inquiry'
                  )}
                </Button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}