import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Calendar, Clock, ArrowRight, User } from 'lucide-react';
import { motion } from 'framer-motion';

const blogPosts = [
  {
    id: 1,
    title: "The Ancient Secret of Sea Buckthorn: From Ramayana to Modern Science",
    excerpt: "Discover how this legendary Sanjeevani Booti has been used for centuries and what modern science reveals about its incredible health benefits.",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692d8181feb1ac797ea503b0/012a2674c_san.JPG",
    date: "December 20, 2024",
    readTime: "5 min read",
    author: "Noor Herbs Team",
    category: "History & Culture"
  },
  {
    id: 2,
    title: "Sea Buckthorn: The Superfruit That Powers Olympic Champions",
    excerpt: "Learn why this golden berry was declared the 'National Drink' at the 2008 Beijing Olympics and how it enhances athletic performance.",
    image: "https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=800",
    date: "December 15, 2024",
    readTime: "4 min read",
    author: "Noor Herbs Team",
    category: "Health & Wellness"
  },
  {
    id: 3,
    title: "Genghis Khan's Secret Weapon: Sea Buckthorn for Strength",
    excerpt: "Explore how the great Mongolian emperor used sea buckthorn to strengthen his armies and conquer vast territories.",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692d8181feb1ac797ea503b0/9fd1e2a93_changezkhan.JPG",
    date: "December 10, 2024",
    readTime: "6 min read",
    author: "Noor Herbs Team",
    category: "History & Culture"
  },
  {
    id: 4,
    title: "15 Scientifically Proven Health Benefits of Sea Buckthorn",
    excerpt: "Based on over 120 research studies, discover the evidence-backed benefits of this wonder berry for immunity, skin, and overall wellness.",
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=800",
    date: "December 5, 2024",
    readTime: "8 min read",
    author: "Noor Herbs Team",
    category: "Health & Wellness"
  },
  {
    id: 5,
    title: "Sea Buckthorn from Ladakh: Why Location Matters",
    excerpt: "Understand why sea buckthorn grown in the high-altitude regions of Ladakh is considered the finest quality in the world.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800",
    date: "November 30, 2024",
    readTime: "5 min read",
    author: "Noor Herbs Team",
    category: "Product Knowledge"
  },
  {
    id: 6,
    title: "The King of Vitamin C: Sea Buckthorn vs Orange",
    excerpt: "Sea buckthorn contains 12 times more Vitamin C than oranges. Learn about its exceptional nutritional profile and rare Omega-7.",
    image: "https://images.unsplash.com/photo-1589927986089-35812378d4a9?q=80&w=800",
    date: "November 25, 2024",
    readTime: "4 min read",
    author: "Noor Herbs Team",
    category: "Nutrition"
  }
];

export default function Blog() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Noor Herbs Blog
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/90 max-w-2xl mx-auto"
          >
            Discover ancient wisdom and modern science behind natural wellness
          </motion.p>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {post.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors">
                  {post.title}
                </h2>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <User className="w-4 h-4" />
                    <span>{post.author}</span>
                  </div>
                  <Link to={createPageUrl(`BlogPost?id=${post.id}`)}>
                    <button className="text-orange-600 hover:text-orange-700 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read More
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 py-16 px-4 mt-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Experience the Benefits?
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Try our premium Sea Buckthorn Juice from Ladakh
          </p>
          <Link to={createPageUrl("Shop")}>
            <button className="bg-white text-orange-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors">
              Shop Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}