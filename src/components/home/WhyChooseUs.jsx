import React from 'react';
import { motion } from "framer-motion";
import { Leaf, FlaskConical, Award, Truck, HeartHandshake, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: Leaf,
    title: "100% Natural",
    description: "Pure herbal formulations with no artificial additives or chemicals",
    color: "bg-green-100 text-green-600"
  },
  {
    icon: FlaskConical,
    title: "Lab Tested",
    description: "Every product undergoes rigorous quality testing for safety and efficacy",
    color: "bg-blue-100 text-blue-600"
  },
  {
    icon: Award,
    title: "Premium Quality",
    description: "Sourced from the pristine valleys of Ladakh for maximum potency",
    color: "bg-amber-100 text-amber-600"
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Quick and reliable delivery across India with order tracking",
    color: "bg-purple-100 text-purple-600"
  },
  {
    icon: HeartHandshake,
    title: "Expert Support",
    description: "Dedicated customer support to guide your wellness journey",
    color: "bg-rose-100 text-rose-600"
  },
  {
    icon: ShieldCheck,
    title: "FSSAI Approved",
    description: "All products are certified and comply with safety standards",
    color: "bg-orange-100 text-orange-600"
  }
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-orange-600 font-medium text-sm uppercase tracking-wider"
          >
            Why Noor Herbs
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-4"
          >
            Specialized Ayurvedic Wellness
          </motion.h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Experience the healing power of nature with our premium herbal products, 
            crafted with decades of Ayurvedic expertise.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group p-6 rounded-2xl hover:bg-gradient-to-br hover:from-orange-50 hover:to-amber-50 transition-all duration-300"
              >
                <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}