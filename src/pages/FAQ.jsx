import React, { useState, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search, HelpCircle, Package, Leaf, Heart, ShoppingCart, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const faqData = [
  {
    category: "Product Information",
    icon: Package,
    questions: [
      {
        q: "What is Sea Buckthorn?",
        a: "Sea buckthorn is a nutrient-dense berry that grows in the high-altitude regions of the Himalayas. Known as the 'King of Vitamin C,' it contains 15x more Vitamin C than oranges, plus rare Omega 3, 6, 9, and the unique Omega-7. It's often called the modern-day Sanjeevani Booti due to its comprehensive health benefits."
      },
      {
        q: "Where does your Sea Buckthorn come from?",
        a: "All our sea buckthorn is wild-harvested from the pristine valleys of Ladakh at altitudes between 9,000-15,000 feet. The extreme Himalayan conditions force the plants to develop higher concentrations of nutrients, making Ladakh sea buckthorn the finest quality in the world."
      },
      {
        q: "What makes Noor Herbs Sea Buckthorn different?",
        a: "Our sea buckthorn is 100% pure with no preservatives, artificial colors, or additives. We source directly from Ladakh, hand-pick berries at peak ripeness, and process them immediately to preserve maximum nutrients. We're DRDO approved, GMP certified, and FSSAI approved."
      },
      {
        q: "Is your product organic?",
        a: "Our sea buckthorn is wild-harvested from its natural Himalayan habitat, which means it grows naturally without any pesticides, fertilizers, or chemicals. While not certified organic (as wild plants cannot be certified), it is naturally pesticide-free and chemical-free."
      }
    ]
  },
  {
    category: "Health Benefits",
    icon: Heart,
    questions: [
      {
        q: "What are the main health benefits of Sea Buckthorn?",
        a: "Sea buckthorn offers comprehensive health benefits including: immune system boost, anti-aging and skin health, heart health support, digestive wellness, energy and stamina increase, liver protection, weight management, and potential cancer prevention properties. It contains over 190 bioactive compounds that work synergistically."
      },
      {
        q: "Can Sea Buckthorn help with skin problems?",
        a: "Yes! Sea buckthorn is exceptional for skin health. The rare Omega-7 promotes skin hydration, elasticity, and glow. It helps with dry skin, eczema, acne, and signs of aging. Many users report visible improvements in skin texture and radiance within 2-4 weeks of regular use."
      },
      {
        q: "Is it good for immunity?",
        a: "Absolutely! With 15x more Vitamin C than oranges plus powerful antioxidants, flavonoids, and carotenoids, sea buckthorn is one of nature's strongest immunity boosters. It helps your body fight infections, reduces inflammation, and strengthens natural defenses."
      },
      {
        q: "Can it help with digestive issues?",
        a: "Yes, sea buckthorn has been clinically proven to help with acid reflux, stomach ulcers, and inflammatory bowel conditions. It soothes the digestive tract, promotes healing of the gut lining, and supports healthy digestion."
      },
      {
        q: "Will it give me more energy?",
        a: "Yes! Sea buckthorn is rich in B vitamins, amino acids, and essential minerals that combat fatigue and increase vitality. Many users report feeling more energetic and less tired within the first week of regular consumption."
      }
    ]
  },
  {
    category: "Usage & Dosage",
    icon: Leaf,
    questions: [
      {
        q: "How much should I take daily?",
        a: "For general wellness, we recommend 30-50ml (2-3 tablespoons) of sea buckthorn juice daily. For specific health conditions or intensive therapy, you can take up to 100ml per day. It's best taken on an empty stomach in the morning or 30 minutes before meals."
      },
      {
        q: "Can I mix it with other juices?",
        a: "Yes! Sea buckthorn has a tart, tangy flavor. You can mix it with water, honey, other fruit juices, or smoothies. Many people enjoy it with orange juice, apple juice, or in their morning smoothie."
      },
      {
        q: "How long does it take to see results?",
        a: "Most people notice increased energy within 3-7 days. Skin improvements typically appear within 2-4 weeks. For immunity and overall health benefits, consistent use for 1-3 months is recommended to experience the full effects."
      },
      {
        q: "Can children take Sea Buckthorn?",
        a: "Yes! Sea buckthorn is safe for children above 5 years old. Recommended dosage for children is 15-20ml per day. It's excellent for boosting children's immunity, especially during cold and flu season."
      },
      {
        q: "Any side effects?",
        a: "Sea buckthorn is generally very safe with no known side effects when taken in recommended amounts. However, start with a smaller dose (1 tablespoon) if you have a sensitive stomach. If you're on blood thinners or have a medical condition, consult your doctor first."
      }
    ]
  },
  {
    category: "Ordering & Shipping",
    icon: ShoppingCart,
    questions: [
      {
        q: "Do you offer free shipping?",
        a: "Yes! We offer free shipping on all orders above ₹500. For orders below ₹500, standard shipping charges apply."
      },
      {
        q: "How long does delivery take?",
        a: "We typically deliver within 3-7 business days depending on your location. Metro cities receive orders faster (3-4 days), while remote areas may take up to 7 days."
      },
      {
        q: "Do you ship internationally?",
        a: "Currently, we ship only within India. We're working on international shipping and will announce it soon!"
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept all major payment methods including: Credit/Debit Cards, UPI, Net Banking, and Cash on Delivery (COD). Online payments are processed securely through Razorpay."
      },
      {
        q: "Can I track my order?",
        a: "Yes! Once your order is shipped, you'll receive a tracking number via email and SMS. You can also track your order anytime using our Track Order page."
      },
      {
        q: "What is your return/refund policy?",
        a: "We offer a 7-day return policy for unopened products. If you receive a damaged or defective product, contact us immediately for a full refund or replacement. Customer satisfaction is our priority!"
      }
    ]
  },
  {
    category: "Storage & Shelf Life",
    icon: Package,
    questions: [
      {
        q: "How should I store Sea Buckthorn juice?",
        a: "Store unopened bottles in a cool, dry place away from direct sunlight. Once opened, refrigerate immediately and consume within 30 days for best quality and freshness."
      },
      {
        q: "What is the shelf life?",
        a: "Unopened bottles have a shelf life of 12 months from the manufacturing date. The expiry date is printed on each bottle."
      },
      {
        q: "Why does the juice separate?",
        a: "Sea buckthorn juice naturally separates because it's 100% pure with no stabilizers or additives. Simply shake well before use. This separation is actually a sign of purity!"
      }
    ]
  }
];

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredFAQs = useMemo(() => {
    let result = faqData;

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter(cat => cat.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      result = result.map(category => ({
        ...category,
        questions: category.questions.filter(q =>
          q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(cat => cat.questions.length > 0);
    }

    return result;
  }, [searchQuery, selectedCategory]);

  const totalQuestions = faqData.reduce((sum, cat) => sum + cat.questions.length, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <HelpCircle className="w-16 h-16 text-white mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-white/90">
              Find answers to common questions about Sea Buckthorn and our products
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 rounded-full bg-white shadow-lg border-gray-200"
            />
          </div>
          <p className="text-center text-gray-500 mt-4">
            {totalQuestions} questions answered
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            className={selectedCategory === "all" ? "bg-orange-500 hover:bg-orange-600" : ""}
            onClick={() => setSelectedCategory("all")}
          >
            All Categories
          </Button>
          {faqData.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <Button
                key={idx}
                variant={selectedCategory === cat.category ? "default" : "outline"}
                className={selectedCategory === cat.category ? "bg-orange-500 hover:bg-orange-600" : ""}
                onClick={() => setSelectedCategory(cat.category)}
              >
                <Icon className="w-4 h-4 mr-2" />
                {cat.category}
              </Button>
            );
          })}
        </motion.div>

        {/* FAQ Sections */}
        <div className="max-w-4xl mx-auto space-y-8">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No questions found matching your search.</p>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                variant="outline"
                className="mt-4"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            filteredFAQs.map((category, idx) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * idx }}
                  className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-orange-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">{category.category}</h2>
                  </div>

                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((item, qIdx) => (
                      <AccordionItem key={qIdx} value={`item-${idx}-${qIdx}`}>
                        <AccordionTrigger className="text-left text-lg font-medium text-gray-900 hover:text-orange-600">
                          {item.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-700 leading-relaxed">
                          {item.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Still Have Questions CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-2xl mx-auto mt-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-8 text-center text-white"
        >
          <Phone className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Still Have Questions?</h3>
          <p className="text-white/90 mb-6">
            Our team is here to help! Get in touch with us anytime.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to={createPageUrl("Contact")}>
              <Button className="bg-white text-orange-600 hover:bg-gray-100 h-12 px-8 rounded-full">
                Contact Us
              </Button>
            </Link>
            <a href="tel:+917009039292">
              <Button variant="outline" className="border-2 border-white text-white hover:bg-white/10 h-12 px-8 rounded-full">
                Call: +91 70090 39292
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}