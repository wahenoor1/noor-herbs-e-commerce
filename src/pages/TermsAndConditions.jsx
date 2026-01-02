import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Link to={createPageUrl('Home')}>
            <Button variant="ghost" className="text-white hover:text-white/80 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <FileText className="w-16 h-16 text-white mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-white mb-4">Terms & Conditions</h1>
            <p className="text-white/90 text-lg">Last updated: January 2, 2026</p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              Welcome to Noor Herbs. These Terms and Conditions govern your use of our website and the purchase of products from us. By accessing our website and placing an order, you agree to be bound by these terms. Please read them carefully before making any purchase.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Use of Website</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              By using our website, you warrant that:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>You are at least 18 years of age</li>
              <li>You have the legal capacity to enter into binding contracts</li>
              <li>All information provided by you is accurate and complete</li>
              <li>You will not use the website for any unlawful purposes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Product Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We make every effort to display our products accurately, including:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Product descriptions are for general information purposes</li>
              <li>Colors may vary slightly due to screen settings</li>
              <li>We reserve the right to modify product specifications without notice</li>
              <li>All products are subject to availability</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Pricing and Payment</h2>
            <div className="space-y-3 text-gray-700">
              <p>All prices are listed in Indian Rupees (INR) and include applicable taxes unless otherwise stated.</p>
              <ul className="list-disc list-inside space-y-2">
                <li>We reserve the right to change prices without prior notice</li>
                <li>Payment must be made at the time of order placement</li>
                <li>We accept Cash on Delivery (COD) and online payments via Razorpay</li>
                <li>COD orders may be subject to verification before dispatch</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Orders and Delivery</h2>
            <div className="space-y-3 text-gray-700">
              <p><strong>Order Processing:</strong></p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>Orders are processed within 1-2 business days</li>
                <li>We reserve the right to refuse or cancel any order</li>
                <li>Delivery times may vary based on location</li>
              </ul>
              <p><strong>Shipping:</strong></p>
              <ul className="list-disc list-inside space-y-2">
                <li>Free shipping on orders above ₹500</li>
                <li>Delivery within 5-7 business days (metro cities)</li>
                <li>7-10 business days for other locations</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Returns and Refunds</h2>
            <p className="text-gray-700 leading-relaxed">
              Please refer to our <Link to={createPageUrl('RefundPolicy')} className="text-orange-600 hover:underline">Refund Policy</Link> for detailed information about returns, refunds, and exchanges.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Product Usage and Disclaimers</h2>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-4">
              <p className="text-gray-700 font-medium mb-2">Important Notice:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Our products are dietary supplements and not intended to diagnose, treat, cure, or prevent any disease</li>
                <li>Consult with a healthcare professional before use, especially if pregnant, nursing, or taking medication</li>
                <li>Keep out of reach of children</li>
                <li>Discontinue use if adverse reactions occur</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed">
              All content on this website, including text, images, logos, and product names, are the property of Noor Herbs and are protected by copyright and trademark laws. You may not reproduce, distribute, or use any content without our express written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              Noor Herbs shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our products or website. Our liability is limited to the purchase price of the product.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Privacy Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We are committed to protecting your privacy. Any personal information collected will be used solely for order processing and communication. We do not share your information with third parties without your consent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms and Conditions are governed by the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in Amritsar, Punjab.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting to the website. Your continued use of the website after changes constitutes acceptance of the modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              For questions about these Terms and Conditions, please contact us:
            </p>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700"><strong>Noor Herbs</strong></p>
              <p className="text-gray-700">Sultanwind Rd, Mandir Wala Bazar, Gobind Nagar</p>
              <p className="text-gray-700">Amritsar, Punjab 143006</p>
              <p className="text-gray-700 mt-2"><strong>Email:</strong> info@noorherbs.com</p>
              <p className="text-gray-700"><strong>Phone:</strong> +91-98032-73425</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}