import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Calendar, Clock, User, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const blogPosts = {
  1: {
    id: 1,
    title: "The Ancient Secret of Sea Buckthorn: From Ramayana to Modern Science",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692d8181feb1ac797ea503b0/012a2674c_san.JPG",
    date: "December 20, 2024",
    readTime: "5 min read",
    author: "Noor Herbs Team",
    category: "History & Culture",
    content: `
<p class="text-lg leading-relaxed mb-6">
Sea buckthorn has been revered for millennia, and its story is as rich as its nutritional profile. According to ancient texts and modern scientific studies, this remarkable berry shares all the medicinal properties attributed to the legendary Sanjeevani Booti mentioned in the epic Ramayana.
</p>

<h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">The Legend of Sanjeevani Booti</h2>
<p class="text-lg leading-relaxed mb-6">
In the Ramayana, when Lord Rama's younger brother Lakshman Ji was gravely wounded in battle, the physician Sushena prescribed the miraculous Sanjeevani herb to save his life. Hanuman Ji was sent to fetch it from the Himalayas, and it brought Lakshman back to life.
</p>

<p class="text-lg leading-relaxed mb-6">
Modern scientists studying sea buckthorn have found that its comprehensive healing properties align remarkably with the descriptions of Sanjeevani Booti. This is why many Ayurvedic practitioners and researchers now refer to sea buckthorn as the modern-day Sanjeevani Booti.
</p>

<h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">The Himalayan Connection</h2>
<p class="text-lg leading-relaxed mb-6">
Just like the mythical Sanjeevani, sea buckthorn grows in the harsh, high-altitude regions of the Himalayas. The plant's roots dig 200 feet deep into the ground to survive extreme conditions, concentrating nutrients that make it one of nature's most powerful healing plants.
</p>

<h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Scientific Validation</h2>
<p class="text-lg leading-relaxed mb-6">
Over 120 scientific research studies have been conducted on sea buckthorn, establishing its benefits for:
</p>

<ul class="space-y-3 mb-6 ml-6">
  <li class="flex gap-3">
    <span class="text-orange-500 mt-1">✓</span>
    <span class="text-lg">Immunity enhancement and infection prevention</span>
  </li>
  <li class="flex gap-3">
    <span class="text-orange-500 mt-1">✓</span>
    <span class="text-lg">Skin health and anti-aging properties</span>
  </li>
  <li class="flex gap-3">
    <span class="text-orange-500 mt-1">✓</span>
    <span class="text-lg">Cardiovascular health and blood circulation</span>
  </li>
  <li class="flex gap-3">
    <span class="text-orange-500 mt-1">✓</span>
    <span class="text-lg">Digestive wellness and gut healing</span>
  </li>
  <li class="flex gap-3">
    <span class="text-orange-500 mt-1">✓</span>
    <span class="text-lg">Liver protection and detoxification</span>
  </li>
</ul>

<h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Noor Herbs: Bringing the Legend to Life</h2>
<p class="text-lg leading-relaxed mb-6">
At Noor Herbs, we source our sea buckthorn directly from the pristine valleys of Ladakh, where the berries grow naturally in their native Himalayan habitat. Our juice is 100% pure, with no preservatives or artificial additives, ensuring you receive all the life-giving benefits of this ancient superfruit.
</p>

<p class="text-lg leading-relaxed mb-6">
Experience the power of Sanjeevani Booti in your daily life with Noor Herbs Sea Buckthorn Juice.
</p>
    `
  },
  2: {
    id: 2,
    title: "Sea Buckthorn: The Superfruit That Powers Olympic Champions",
    image: "https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=800",
    date: "December 15, 2024",
    readTime: "4 min read",
    author: "Noor Herbs Team",
    category: "Health & Wellness",
    content: `
<p class="text-lg leading-relaxed mb-6">
When the 2008 Beijing Olympics declared sea buckthorn as the "National Drink," the world took notice. But Chinese athletes had known this secret for decades – sea buckthorn is nature's ultimate performance enhancer.
</p>

<h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">The Olympic Connection</h2>
<p class="text-lg leading-relaxed mb-6">
Sea buckthorn has been a staple in the diet of Chinese Olympians for years. Its exceptional nutritional profile made it the perfect choice for athletes seeking natural performance enhancement without artificial supplements.
</p>

<h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Why Athletes Love Sea Buckthorn</h2>
<p class="text-lg leading-relaxed mb-6">
The benefits for athletic performance are backed by science:
</p>

<ul class="space-y-3 mb-6 ml-6">
  <li class="flex gap-3">
    <span class="text-orange-500 mt-1">✓</span>
    <span class="text-lg"><strong>Energy & Stamina:</strong> Rich in B vitamins and amino acids for sustained energy</span>
  </li>
  <li class="flex gap-3">
    <span class="text-orange-500 mt-1">✓</span>
    <span class="text-lg"><strong>Quick Recovery:</strong> Anti-inflammatory compounds reduce muscle soreness</span>
  </li>
  <li class="flex gap-3">
    <span class="text-orange-500 mt-1">✓</span>
    <span class="text-lg"><strong>Immune Support:</strong> High Vitamin C content prevents illness during training</span>
  </li>
  <li class="flex gap-3">
    <span class="text-orange-500 mt-1">✓</span>
    <span class="text-lg"><strong>Hydration:</strong> Omega-7 supports cellular hydration</span>
  </li>
</ul>

<h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Not Just for Elite Athletes</h2>
<p class="text-lg leading-relaxed mb-6">
Whether you're training for a marathon or simply want more energy for daily activities, sea buckthorn can help. Its comprehensive nutritional profile supports anyone with an active lifestyle.
</p>

<p class="text-lg leading-relaxed mb-6">
Join the ranks of Olympic champions – make Noor Herbs Sea Buckthorn Juice part of your daily routine.
</p>
    `
  },
  3: {
    id: 3,
    title: "Genghis Khan's Secret Weapon: Sea Buckthorn for Strength",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692d8181feb1ac797ea503b0/9fd1e2a93_changezkhan.JPG",
    date: "December 10, 2024",
    readTime: "6 min read",
    author: "Noor Herbs Team",
    category: "History & Culture",
    content: `
<p class="text-lg leading-relaxed mb-6">
Genghis Khan, the legendary Mongolian emperor of the 13th century, conquered vast territories and built one of history's largest empires. His secret? He attributed his success to three powers: a well-arranged army, strong discipline, and sea buckthorn.
</p>

<h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">The Khan's Three Powers</h2>
<p class="text-lg leading-relaxed mb-6">
Historical records show that Genghis Khan regularly gave sea buckthorn to his soldiers and their horses to increase their strength and stamina. This gave his army a significant advantage during long campaigns across harsh terrain.
</p>

<h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Why It Worked</h2>
<p class="text-lg leading-relaxed mb-6">
Modern science reveals why sea buckthorn was so effective for the Mongolian warriors:
</p>

<ul class="space-y-3 mb-6 ml-6">
  <li class="flex gap-3">
    <span class="text-orange-500 mt-1">✓</span>
    <span class="text-lg">Enhanced endurance for long marches and battles</span>
  </li>
  <li class="flex gap-3">
    <span class="text-orange-500 mt-1">✓</span>
    <span class="text-lg">Quick wound healing and recovery from injuries</span>
  </li>
  <li class="flex gap-3">
    <span class="text-orange-500 mt-1">✓</span>
    <span class="text-lg">Protection against harsh weather and altitude sickness</span>
  </li>
  <li class="flex gap-3">
    <span class="text-orange-500 mt-1">✓</span>
    <span class="text-lg">Maintained health during long campaigns with limited food</span>
  </li>
</ul>

<h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">For Horses Too</h2>
<p class="text-lg leading-relaxed mb-6">
The Mongolians didn't just give sea buckthorn to their soldiers – they also fed it to their horses. The berries improved the horses' coat shine, stamina, and overall health, making them superior to their opponents' steeds.
</p>

<p class="text-lg leading-relaxed mb-6">
While you may not be building an empire, you can still benefit from the same natural strength and vitality that powered history's greatest warriors. Try Noor Herbs Sea Buckthorn Juice today.
</p>
    `
  },
  4: {
    id: 4,
    title: "15 Scientifically Proven Health Benefits of Sea Buckthorn",
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=800",
    date: "December 5, 2024",
    readTime: "8 min read",
    author: "Noor Herbs Team",
    category: "Health & Wellness",
    content: `
<p class="text-lg leading-relaxed mb-6">
With over 120 clinical research studies conducted worldwide, sea buckthorn stands as one of the most scientifically validated natural health supplements. Here are 15 evidence-backed benefits:
</p>

<h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Immunity & Disease Prevention</h2>
<ul class="space-y-3 mb-6 ml-6">
  <li class="flex gap-3">
    <span class="text-orange-500 mt-1">1.</span>
    <span class="text-lg"><strong>Boosts Immune System:</strong> High in Vitamin C and antioxidants that strengthen natural defenses</span>
  </li>
  <li class="flex gap-3">
    <span class="text-orange-500 mt-1">2.</span>
    <span class="text-lg"><strong>Anti-Cancer Properties:</strong> Flavonoids may help prevent cell mutations</span>
  </li>
  <li class="flex gap-3">
    <span class="text-orange-500 mt-1">3.</span>
    <span class="text-lg"><strong>Anti-Inflammatory:</strong> Reduces chronic inflammation throughout the body</span>
  </li>
</ul>

<h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Heart & Circulation</h2>
<ul class="space-y-3 mb-6 ml-6">
  <li class="flex gap-3">
    <span class="text-orange-500 mt-1">4.</span>
    <span class="text-lg"><strong>Heart Health:</strong> Omega fatty acids support cardiovascular function</span>
  </li>
  <li class="flex gap-3">
    <span class="text-orange-500 mt-1">5.</span>
    <span class="text-lg"><strong>Blood Pressure:</strong> Helps maintain healthy blood pressure levels</span>
  </li>
  <li class="flex gap-3">
    <span class="text-orange-500 mt-1">6.</span>
    <span class="text-lg"><strong>Cholesterol:</strong> May help balance cholesterol levels</span>
  </li>
</ul>

<h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Skin & Beauty</h2>
<ul class="space-y-3 mb-6 ml-6">
  <li class="flex gap-3">
    <span class="text-orange-500 mt-1">7.</span>
    <span class="text-lg"><strong>Radiant Skin:</strong> Omega-7 promotes skin hydration and glow</span>
  </li>
  <li class="flex gap-3">
    <span class="text-orange-500 mt-1">8.</span>
    <span class="text-lg"><strong>Anti-Aging:</strong> Antioxidants combat wrinkles and age spots</span>
  </li>
  <li class="flex gap-3">
    <span class="text-orange-500 mt-1">9.</span>
    <span class="text-lg"><strong>Wound Healing:</strong> Accelerates healing of cuts and burns</span>
  </li>
</ul>

<h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Digestive & Metabolic</h2>
<ul class="space-y-3 mb-6 ml-6">
  <li class="flex gap-3">
    <span class="text-orange-500 mt-1">10.</span>
    <span class="text-lg"><strong>Digestive Health:</strong> Soothes stomach ulcers and acid reflux</span>
  </li>
  <li class="flex gap-3">
    <span class="text-orange-500 mt-1">11.</span>
    <span class="text-lg"><strong>Liver Protection:</strong> Helps detoxify and protect the liver</span>
  </li>
  <li class="flex gap-3">
    <span class="text-orange-500 mt-1">12.</span>
    <span class="text-lg"><strong>Weight Management:</strong> Supports healthy metabolism</span>
  </li>
</ul>

<h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Energy & Wellness</h2>
<ul class="space-y-3 mb-6 ml-6">
  <li class="flex gap-3">
    <span class="text-orange-500 mt-1">13.</span>
    <span class="text-lg"><strong>Energy Boost:</strong> B vitamins combat fatigue</span>
  </li>
  <li class="flex gap-3">
    <span class="text-orange-500 mt-1">14.</span>
    <span class="text-lg"><strong>Eye Health:</strong> Carotenoids protect vision</span>
  </li>
  <li class="flex gap-3">
    <span class="text-orange-500 mt-1">15.</span>
    <span class="text-lg"><strong>Brain Function:</strong> Omega fatty acids support cognitive health</span>
  </li>
</ul>

<p class="text-lg leading-relaxed mb-6">
With all these scientifically proven benefits, it's no wonder sea buckthorn is called the "Superfruit of the Century." Experience them yourself with Noor Herbs Sea Buckthorn Juice.
</p>
    `
  },
  5: {
    id: 5,
    title: "Sea Buckthorn from Ladakh: Why Location Matters",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800",
    date: "November 30, 2024",
    readTime: "5 min read",
    author: "Noor Herbs Team",
    category: "Product Knowledge",
    content: `
<p class="text-lg leading-relaxed mb-6">
Not all sea buckthorn is created equal. The berries harvested from Ladakh's high-altitude regions are considered the finest quality in the world. Here's why location makes all the difference.
</p>

<h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">The Himalayan Advantage</h2>
<p class="text-lg leading-relaxed mb-6">
Ladakh sits at altitudes between 9,000 to 15,000 feet in the Himalayas. At these heights, sea buckthorn plants face extreme conditions that force them to develop higher concentrations of nutrients:
</p>

<ul class="space-y-3 mb-6 ml-6">
  <li class="flex gap-3">
    <span class="text-orange-500 mt-1">✓</span>
    <span class="text-lg">Intense UV radiation increases antioxidant production</span>
  </li>
  <li class="flex gap-3">
    <span class="text-orange-500 mt-1">✓</span>
    <span class="text-lg">Extreme temperature swings enhance nutrient density</span>
  </li>
  <li class="flex gap-3">
    <span class="text-orange-500 mt-1">✓</span>
    <span class="text-lg">Pure mountain air and pristine soil ensure chemical-free berries</span>
  </li>
  <li class="flex gap-3">
    <span class="text-orange-500 mt-1">✓</span>
    <span class="text-lg">Deep root systems (up to 200 feet) access rare minerals</span>
  </li>
</ul>

<h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">DRDO Recognition</h2>
<p class="text-lg leading-relaxed mb-6">
The Defence Research and Development Organization (DRDO) of India specifically recommends Ladakh sea buckthorn for soldiers serving in high-altitude regions, recognizing its superior quality and effectiveness.
</p>

<h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Noor Herbs' Commitment</h2>
<p class="text-lg leading-relaxed mb-6">
We source only wild-harvested sea buckthorn from Ladakh's pristine valleys. Our berries are hand-picked at peak ripeness and processed immediately to preserve maximum nutrients. No preservatives, no artificial colors – just pure Himalayan goodness.
</p>

<p class="text-lg leading-relaxed mb-6">
When you choose Noor Herbs, you're getting the finest sea buckthorn the Himalayas have to offer.
</p>
    `
  },
  6: {
    id: 6,
    title: "The King of Vitamin C: Sea Buckthorn vs Orange",
    image: "https://images.unsplash.com/photo-1589927986089-35812378d4a9?q=80&w=800",
    date: "November 25, 2024",
    readTime: "4 min read",
    author: "Noor Herbs Team",
    category: "Nutrition",
    content: `
<p class="text-lg leading-relaxed mb-6">
When it comes to Vitamin C, oranges have dominated the conversation for decades. But sea buckthorn quietly holds the crown with 12-15 times more Vitamin C than oranges – plus rare nutrients no citrus fruit can match.
</p>

<h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">The Vitamin C Champion</h2>
<p class="text-lg leading-relaxed mb-6">
While an average orange contains about 50mg of Vitamin C per 100g, sea buckthorn berries pack a whopping 600-750mg per 100g. That's not just a slight advantage – it's a complete game-changer for your immune system.
</p>

<h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Beyond Vitamin C</h2>
<p class="text-lg leading-relaxed mb-6">
What truly sets sea buckthorn apart is its comprehensive nutritional profile:
</p>

<ul class="space-y-3 mb-6 ml-6">
  <li class="flex gap-3">
    <span class="text-orange-500 mt-1">✓</span>
    <span class="text-lg"><strong>Omega 3, 6, 9 & 7:</strong> The only plant source with all four essential omegas</span>
  </li>
  <li class="flex gap-3">
    <span class="text-orange-500 mt-1">✓</span>
    <span class="text-lg"><strong>Vitamin E:</strong> Multiple times more than almonds</span>
  </li>
  <li class="flex gap-3">
    <span class="text-orange-500 mt-1">✓</span>
    <span class="text-lg"><strong>Vitamin A:</strong> Essential for eye health and immunity</span>
  </li>
  <li class="flex gap-3">
    <span class="text-orange-500 mt-1">✓</span>
    <span class="text-lg"><strong>18 Amino Acids:</strong> Building blocks of protein</span>
  </li>
  <li class="flex gap-3">
    <span class="text-orange-500 mt-1">✓</span>
    <span class="text-lg"><strong>190+ Bioactive Compounds:</strong> More than any other plant</span>
  </li>
</ul>

<h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">The Rare Omega-7</h2>
<p class="text-lg leading-relaxed mb-6">
Perhaps most impressive is sea buckthorn's Omega-7 content. This rare fatty acid is crucial for:
</p>

<ul class="space-y-3 mb-6 ml-6">
  <li class="flex gap-3">
    <span class="text-orange-500 mt-1">•</span>
    <span class="text-lg">Skin hydration and elasticity</span>
  </li>
  <li class="flex gap-3">
    <span class="text-orange-500 mt-1">•</span>
    <span class="text-lg">Mucous membrane health</span>
  </li>
  <li class="flex gap-3">
    <span class="text-orange-500 mt-1">•</span>
    <span class="text-lg">Cellular regeneration</span>
  </li>
  <li class="flex gap-3">
    <span class="text-orange-500 mt-1">•</span>
    <span class="text-lg">Anti-inflammatory effects</span>
  </li>
</ul>

<p class="text-lg leading-relaxed mb-6">
No orange can compete with that. Upgrade your nutrition with Noor Herbs Sea Buckthorn Juice – nature's true vitamin C king.
</p>
    `
  }
};

export default function BlogPost() {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = parseInt(urlParams.get('id'));
  
  const post = blogPosts[postId];

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-6">The blog post you're looking for doesn't exist.</p>
          <Link to={createPageUrl("Blog")}>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      <div className="relative h-96 bg-gray-900">
        <img 
          src={post.image} 
          alt={post.title}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10 pb-16">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-8 md:p-12">
            {/* Back Button */}
            <Link to={createPageUrl("Blog")} className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>

            {/* Category Badge */}
            <div className="mb-4">
              <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                {post.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8 pb-8 border-b">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.readTime}</span>
              </div>
            </div>

            {/* Content */}
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* CTA */}
            <div className="mt-12 p-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl text-center">
              <h3 className="text-2xl font-bold text-white mb-4">
                Ready to Experience the Benefits?
              </h3>
              <p className="text-white/90 mb-6">
                Try our premium Sea Buckthorn Juice from Ladakh
              </p>
              <Link to={createPageUrl("Shop")}>
                <Button className="bg-white text-orange-600 hover:bg-gray-100 h-12 px-8 rounded-full">
                  Shop Now
                </Button>
              </Link>
            </div>
          </div>
        </motion.article>
      </div>
    </div>
  );
}