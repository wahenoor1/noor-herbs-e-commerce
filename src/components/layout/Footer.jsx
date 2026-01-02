import React from 'react';
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Leaf, Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Newsletter */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-white mb-2">Subscribe to Our Newsletter</h3>
              <p className="text-white/90">Get updates on new products and exclusive offers</p>
            </div>
            <div className="flex w-full md:w-auto gap-3">
              <Input 
                placeholder="Enter your email" 
                className="bg-white/20 border-white/30 text-white placeholder:text-white/70 w-full md:w-72 rounded-full"
              />
              <Button className="bg-white text-orange-600 hover:bg-gray-100 rounded-full px-6">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-green-600 rounded-xl flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Noor Herbs</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Premium herbal products sourced from Ladakh. 
              100% natural, lab-tested, and FSSAI approved.
            </p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/noorhebs24/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/noor_herbs/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/company/noor-herbs/about/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to={createPageUrl("Home")} className="hover:text-orange-400 transition-colors">Home</Link></li>
              <li><Link to={createPageUrl("Shop")} className="hover:text-orange-400 transition-colors">All Products</Link></li>
              <li><Link to={createPageUrl("About")} className="hover:text-orange-400 transition-colors">About Us</Link></li>
              <li><Link to={createPageUrl("Contact")} className="hover:text-orange-400 transition-colors">Contact Us</Link></li>
              <li><Link to={createPageUrl("TrackOrder")} className="hover:text-orange-400 transition-colors">Track Order</Link></li>
              <li><Link to={createPageUrl("AffiliateLogin")} className="hover:text-orange-400 transition-colors">Affiliate Program</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Categories</h4>
            <ul className="space-y-3">
              <li><Link to={createPageUrl("Shop?category=immunity")} className="hover:text-orange-400 transition-colors">Immunity</Link></li>
              <li><Link to={createPageUrl("Shop?category=energy")} className="hover:text-orange-400 transition-colors">Energy & Vitality</Link></li>
              <li><Link to={createPageUrl("Shop?category=skin_care")} className="hover:text-orange-400 transition-colors">Skin Care</Link></li>
              <li><Link to={createPageUrl("Shop?category=weight_management")} className="hover:text-orange-400 transition-colors">Weight Management</Link></li>
              <li><Link to={createPageUrl("Shop?category=digestive_health")} className="hover:text-orange-400 transition-colors">Digestive Health</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                <span>Sultanwind Rd, Mandir Wala Bazar, Gobind Nagar, Amritsar, Punjab 143006</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-orange-400 flex-shrink-0" />
                <span>+91-98032-73425</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-orange-400 flex-shrink-0" />
                <span>info@noorherbs.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-500">
                © 2024 Noor Herbs. All rights reserved.
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Developed by{' '}
                <a 
                  href="https://www.wahenoormedia.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-300 transition-colors"
                >
                  Wahenoor Digital Media
                </a>
              </p>
            </div>
            <div className="flex gap-6 text-sm">
              <Link to="#" className="text-gray-500 hover:text-orange-400">Privacy Policy</Link>
              <Link to="#" className="text-gray-500 hover:text-orange-400">Terms of Service</Link>
              <Link to="#" className="text-gray-500 hover:text-orange-400">Refund Policy</Link>
              <Link to={createPageUrl("AdminProducts")} className="text-gray-600 hover:text-orange-400">Admin</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}