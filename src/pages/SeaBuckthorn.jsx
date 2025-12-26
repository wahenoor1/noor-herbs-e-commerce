import React, { useState } from 'react';
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
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
  Loader2,
  Award,
  Star,
  ShoppingCart
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
    <div className="min-h-screen bg-white">
      {/* Hero Banner with Product Image */}
      <div className="relative bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1566392278241-46e37b11da5e?q=80&w=2000" 
            alt="Sea Buckthorn berries"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/90 to-amber-500/80"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <Leaf className="w-5 h-5 text-white" />
                <span className="text-white font-medium">Heaven's Holy Fruit</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Sea Buckthorn
              </h1>
              <p className="text-2xl text-white/95 mb-4 font-medium">
                The Modern-Day Sanjeevani Booti
              </p>
              <p className="text-lg text-white/90 mb-8 leading-relaxed">
                Nature's most balanced fruit from the Himalayas, packed with over 190 bioactive compounds for ultimate health and vitality
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to={createPageUrl("Shop")}>
                  <Button className="bg-white text-orange-600 hover:bg-gray-100 h-14 px-8 rounded-full text-lg font-medium">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Shop Now
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="border-2 border-white text-white hover:bg-white/10 h-14 px-8 rounded-full text-lg font-medium"
                  onClick={() => document.getElementById('learn-more')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Learn More
                </Button>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692d8181feb1ac797ea503b0/f46928364_WhatsAppImage2025-11-27at144626.jpg"
                  alt="Noor Herbs Sea Buckthorn Juice"
                  className="w-full max-w-md mx-auto drop-shadow-2xl"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* What is Sea Buckthorn */}
      <div id="learn-more" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid lg:grid-cols-2 gap-12 items-center mb-20"
        >
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What is Sea Buckthorn?
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Sea buckthorn (<em>Hippophae rhamnoides</em>) is a golden-orange berry that thrives in the harsh conditions and high altitudes of the Himalayas. Known as <strong>"Heaven's Holy Fruit"</strong>, this wonder berry has been used for centuries in traditional medicine.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              The roots of sea buckthorn bushes go down 200 feet deep into the ground to gather nutrition for survival in the extreme Himalayan climate, making it one of nature's most resilient and nutrient-dense plants.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              In Ayurveda, it's revered as the modern-day <strong>"Sanjeevani Booti"</strong> (life-giving herb), referencing the mythical plant from the Ramayana that was used to revive Lord Rama's brother Lakshman.
            </p>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=1000"
              alt="Sea Buckthorn berries on branch"
              className="rounded-3xl shadow-2xl w-full"
            />
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-xl max-w-xs">
              <div className="flex items-center gap-3 mb-2">
                <Award className="w-8 h-8 text-orange-500" />
                <span className="font-bold text-gray-900">190+</span>
              </div>
              <p className="text-sm text-gray-600">Bioactive Compounds</p>
            </div>
          </div>
        </motion.div>

        {/* Historical Facts with Images - Biosash Style */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-4">
            History & Facts of Seabuckthorn
          </h2>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Sea buckthorn has been treasured across civilizations for over 1,200 years
          </p>

          <div className="max-w-4xl mx-auto space-y-8">
            {/* Sanjeevani Booti */}
            <div className="flex gap-6 items-start">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692d8181feb1ac797ea503b0/012a2674c_san.JPG"
                alt="Sanjeevani Booti - Ramayana"
                className="rounded-xl shadow-lg w-40 h-32 object-cover flex-shrink-0"
              />
              <div>
                <p className="text-gray-700 leading-relaxed">
                  According to scientific studies all medicinal properties of sea buckthorn are similar to the legendary Sanjivani Booti which was used to revive Lord Shree Ram's younger brother Lakshman Ji. That's why it is also called Sanjivini Booti.
                </p>
              </div>
            </div>

            {/* Genghis Khan */}
            <div className="flex gap-6 items-start">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692d8181feb1ac797ea503b0/9fd1e2a93_changezkhan.JPG"
                alt="Changez Khan Army"
                className="rounded-xl shadow-lg w-40 h-32 object-cover flex-shrink-0"
              />
              <div>
                <p className="text-gray-700 leading-relaxed">
                  Mongolian emperor Changez Khan was a great emperor of 13th century. He had faith on his three powers – a well arranged army, strong discipline and sea buckthorn. Changez Khan regularly used to give sea buckthorn to his soldiers and their horses for increasing their strength and stamina.
                </p>
              </div>
            </div>

            {/* Greek Tradition */}
            <div className="flex gap-6 items-start">
              <img 
                src="https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?q=80&w=200"
                alt="Ancient Greek horses"
                className="rounded-xl shadow-lg w-40 h-32 object-cover flex-shrink-0"
              />
              <div>
                <p className="text-gray-700 leading-relaxed">
                  Sea buckthorn is known by it's Greek name "Hippophae rhamnoides" which literally translated means "shiny horse". The Greeks used to give sea buckthorn to their race horses and war horses for better health and shiny hair.
                </p>
              </div>
            </div>

            {/* Tibetan Medicine */}
            <div className="flex gap-6 items-start">
              <img 
                src="https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=200"
                alt="Ancient Tibetan manuscripts"
                className="rounded-xl shadow-lg w-40 h-32 object-cover flex-shrink-0"
              />
              <div>
                <p className="text-gray-700 leading-relaxed">
                  Nutritional compounds and health benefits of sea buckthorn have been mentioned from centuries ago in medicinal books of Europe and Asia. The ancient Tibetan medical book of 18th century "Sibu Yidian" describes sea buckthorn's health benefits and nutritional compounds on 30 of it's pages.
                </p>
              </div>
            </div>

            {/* Olympics */}
            <div className="flex gap-6 items-start">
              <img 
                src="https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=200"
                alt="Olympic athletes"
                className="rounded-xl shadow-lg w-40 h-32 object-cover flex-shrink-0"
              />
              <div>
                <p className="text-gray-700 leading-relaxed">
                  Sea buckthorn is the main part of diet for Chinese Olympians. And in 2008 Olympics at Beijing, sea buckthorn was the "National Drink".
                </p>
              </div>
            </div>

            {/* Scientific Research */}
            <div className="flex gap-6 items-start">
              <img 
                src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=200"
                alt="Scientific research"
                className="rounded-xl shadow-lg w-40 h-32 object-cover flex-shrink-0"
              />
              <div>
                <p className="text-gray-700 leading-relaxed">
                  There are now more than 120 scientific research studies on sea buckthorn for its number of health benefits. There is an extensive body of research on Seabuckthorn from all over the world. Clinical trials have established that it is a wonder berry and the super fruit of the century.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Nutritional Powerhouse */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-3xl p-8 md:p-16 mb-20 text-white"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              A Complete Nutritional Powerhouse
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Sea buckthorn contains over 190 bioactive compounds - more than any other plant on Earth
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <Zap className="w-10 h-10 mb-4" />
              <h3 className="font-bold text-xl mb-3">Rich in Vitamins</h3>
              <p className="text-white/90">
                Vitamin C (15x more than oranges!), A, E, K, and B-complex vitamins
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <Heart className="w-10 h-10 mb-4" />
              <h3 className="font-bold text-xl mb-3">Rare Omegas</h3>
              <p className="text-white/90">
                The only plant with Omega 3, 6, 9 AND rare Omega-7 fatty acids
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <Shield className="w-10 h-10 mb-4" />
              <h3 className="font-bold text-xl mb-3">Antioxidants</h3>
              <p className="text-white/90">
                Powerful flavonoids, carotenoids, and polyphenols for protection
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <Sparkles className="w-10 h-10 mb-4" />
              <h3 className="font-bold text-xl mb-3">Essential Nutrients</h3>
              <p className="text-white/90">
                18 amino acids, essential minerals, and beneficial plant compounds
              </p>
            </div>
          </div>
        </motion.div>

        {/* Health Benefits */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Scientifically Proven Health Benefits
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Backed by over 120 clinical research studies worldwide
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="flex gap-4 bg-green-50 rounded-2xl p-6 border border-green-100">
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Supercharges Immunity</h3>
                <p className="text-gray-700">Exceptional nutrient density strengthens natural defenses and fights infections</p>
              </div>
            </div>
            <div className="flex gap-4 bg-orange-50 rounded-2xl p-6 border border-orange-100">
              <CheckCircle2 className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Radiant Skin & Anti-Aging</h3>
                <p className="text-gray-700">Promotes skin glow, hydration, and reduces signs of aging naturally</p>
              </div>
            </div>
            <div className="flex gap-4 bg-red-50 rounded-2xl p-6 border border-red-100">
              <CheckCircle2 className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Heart Health</h3>
                <p className="text-gray-700">Supports cardiovascular function and maintains healthy blood pressure</p>
              </div>
            </div>
            <div className="flex gap-4 bg-blue-50 rounded-2xl p-6 border border-blue-100">
              <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Digestive Wellness</h3>
                <p className="text-gray-700">Improves digestion, reduces inflammation, and heals gut lining</p>
              </div>
            </div>
            <div className="flex gap-4 bg-purple-50 rounded-2xl p-6 border border-purple-100">
              <CheckCircle2 className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Energy & Stamina</h3>
                <p className="text-gray-700">Increases vitality, combats fatigue, and enhances physical performance</p>
              </div>
            </div>
            <div className="flex gap-4 bg-yellow-50 rounded-2xl p-6 border border-yellow-100">
              <CheckCircle2 className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Liver Protection</h3>
                <p className="text-gray-700">Helps detoxify and protect the liver from oxidative damage</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Product Showcase */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 md:p-16 mb-20 text-white overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <div className="inline-block bg-orange-500/20 text-orange-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
                Premium Quality
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Noor Herbs Sea Buckthorn Juice
              </h2>
              <p className="text-xl text-gray-300 mb-6">
                100% Pure, Wild-Harvested from Ladakh's Pristine Himalayas
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0" />
                  <span className="text-gray-200">King of Vitamin C - 15x more than oranges</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0" />
                  <span className="text-gray-200">Rich in Omega 3, 6, 9 & rare Omega 7</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0" />
                  <span className="text-gray-200">DRDO Approved & GMP Certified</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0" />
                  <span className="text-gray-200">No Preservatives or Artificial Colors</span>
                </li>
              </ul>
              <Link to={createPageUrl("Shop")}>
                <Button className="bg-orange-500 hover:bg-orange-600 h-14 px-8 rounded-full text-lg">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Order Now
                </Button>
              </Link>
            </div>
            <div className="relative">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692d8181feb1ac797ea503b0/e639f29cb_WhatsAppImage2025-11-27at144623.jpg"
                alt="Noor Herbs Sea Buckthorn Juice Product"
                className="w-full max-w-md mx-auto drop-shadow-2xl"
              />
            </div>
          </div>
        </motion.div>

        {/* Video Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Watch & Discover More
            </h2>
            <p className="text-lg text-gray-600">
              Learn from experts about the incredible benefits of Sea Buckthorn
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl bg-gray-100">
              <iframe
                src="https://www.youtube.com/embed/WgHBy053BUU"
                title="Sea Buckthorn - Sanjeevani Booti"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl bg-gray-100">
              <iframe
                src="https://www.instagram.com/reels/DOMk-vQkqGI/embed"
                title="Sea Buckthorn on Instagram"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </motion.div>

        {/* Endorsements */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-8 md:p-12 mb-20 border border-blue-100"
        >
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Trusted & Endorsed Worldwide
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">In India</h3>
              <p className="text-gray-700 leading-relaxed">
                The Defence Research and Development Organization (DRDO) has endorsed and recognizes the immense benefits of Sea Buckthorn. It recommends sea buckthorn for soldiers of the Indian Army, especially those serving in high altitudes.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">In The West</h3>
              <p className="text-gray-700 leading-relaxed">
                Well-known personalities such as Dr. Oz on "The Dr. Oz Show", Oprah Winfrey, Dr. Ro the health Guru, and celebrity makeup artist Melissa Walsh have endorsed the beneficial effects of sea buckthorn for health and beauty.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Lead Capture Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-3xl p-8 md:p-12 shadow-2xl"
        >
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Want to Experience the Benefits?
              </h2>
              <p className="text-lg text-white/90">
                Get in touch with us to learn more about our premium Sea Buckthorn products and start your wellness journey today
              </p>
            </div>

            {submitted ? (
              <div className="bg-white rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
                <p className="text-gray-600 mb-6">
                  We've received your inquiry and our team will contact you within 24 hours.
                </p>
                <Button 
                  onClick={() => setSubmitted(false)}
                  variant="outline"
                  className="rounded-full"
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 md:p-8 space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="name" className="text-gray-700 font-medium">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="mt-2 h-12 rounded-xl"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-gray-700 font-medium">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="mt-2 h-12 rounded-xl"
                      placeholder="+91 XXXXXXXXXX"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email" className="text-gray-700 font-medium">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="mt-2 h-12 rounded-xl"
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="message" className="text-gray-700 font-medium">Your Message</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="mt-2 rounded-xl"
                    rows={4}
                    placeholder="Tell us what you'd like to know about Sea Buckthorn..."
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-lg font-medium shadow-lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      Submit Inquiry
                    </>
                  )}
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  We respect your privacy. Your information will never be shared with third parties.
                </p>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}