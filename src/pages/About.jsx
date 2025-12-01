import React from 'react';
import { motion } from "framer-motion";
import { Leaf, Heart, Award, Users, MapPin, Phone, Mail } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative bg-gradient-to-r from-orange-500 to-amber-500 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            About Noor Herbs
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/90 max-w-2xl mx-auto"
          >
            Passionate advocate of high-quality herbal products, promoting natural wellness and holistic living from Amritsar.
          </motion.p>
        </div>
      </div>

      {/* Our Story */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <span className="text-orange-600 font-medium text-sm uppercase tracking-wider">Our Story</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-6">
                Bringing Ladakh's Treasures to Your Doorstep
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Noor Herbs was founded with a simple mission: to bring the purest and most potent herbal products from the pristine valleys of Ladakh to health-conscious consumers across India.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Our flagship product, Sea Buckthorn Juice, is sourced directly from Ladakh, known for having one of the harshest climates on Earth. This remarkable fruit, often called the "King of Vitamin C," thrives in these extreme conditions, developing an incredibly rich nutritional profile.
              </p>
              <p className="text-gray-600 leading-relaxed">
                The Sea Buckthorn we use is recognized by DRDO (Defence Research & Development Organisation) for its exceptional health benefits, making it a trusted choice for those seeking natural wellness solutions.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <img 
                src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&h=500&fit=crop" 
                alt="Ladakh Mountains"
                className="rounded-3xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-xl">
                <p className="text-4xl font-bold text-orange-600">1000+</p>
                <p className="text-gray-500">Happy Customers</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gradient-to-b from-orange-50 to-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-orange-600 font-medium text-sm uppercase tracking-wider">Our Values</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">What We Stand For</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Leaf, title: "Natural Purity", desc: "100% natural ingredients with no artificial additives" },
              { icon: Heart, title: "Customer First", desc: "Your wellness is our top priority" },
              { icon: Award, title: "Quality Assured", desc: "Lab-tested and FSSAI certified products" },
              { icon: Users, title: "Community", desc: "Building a community of health-conscious individuals" }
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sea Buckthorn Info */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-orange-600 font-medium text-sm uppercase tracking-wider">Our Star Product</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-6">Sea Buckthorn: The Wonder Berry</h2>
          </div>

          <div className="bg-gradient-to-br from-orange-100 to-amber-50 rounded-3xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Why Sea Buckthorn?</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span className="text-gray-600">Known as the "King of Vitamin C" - contains 10-15 times more Vitamin C than oranges</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span className="text-gray-600">Rich in Omega 3, 6, 9 and the rare Omega 7</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span className="text-gray-600">DRDO approved for its exceptional health benefits</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span className="text-gray-600">Packed with antioxidants for overall wellness</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Health Benefits</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs">★</span>
                    </div>
                    <span className="text-gray-600">Boosts immunity and energy levels</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs">★</span>
                    </div>
                    <span className="text-gray-600">Supports skin health and natural glow</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs">★</span>
                    </div>
                    <span className="text-gray-600">Promotes cardiovascular health</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs">★</span>
                    </div>
                    <span className="text-gray-600">Aids in fitness and muscle recovery</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-20 bg-gray-900 text-white px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Visit Our Store</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center mb-4">
                <MapPin className="w-7 h-7" />
              </div>
              <h3 className="font-semibold mb-2">Address</h3>
              <p className="text-gray-400 text-sm">Sultanwind Rd, Mandir Wala Bazar, Gobind Nagar, Amritsar, Punjab 143006</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center mb-4">
                <Phone className="w-7 h-7" />
              </div>
              <h3 className="font-semibold mb-2">Phone</h3>
              <p className="text-gray-400">+91 70090 39292</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-7 h-7" />
              </div>
              <h3 className="font-semibold mb-2">Hours</h3>
              <p className="text-gray-400">Mon - Sat: 9AM - 8PM</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}