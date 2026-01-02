import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';

export default function RefundPolicy() {
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
            <RefreshCw className="w-16 h-16 text-white mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-white mb-4">Refund & Return Policy</h1>
            <p className="text-white/90 text-lg">Last updated: January 2, 2026</p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Return Policy</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              At Noor Herbs, we want you to be completely satisfied with your purchase. If for any reason you are not satisfied, we offer a hassle-free return policy.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Returns accepted within 7 days of delivery</li>
              <li>Products must be unused and in original packaging</li>
              <li>Seal must be unbroken for hygiene and safety reasons</li>
              <li>Original invoice or receipt must be provided</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Refund Process</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Once we receive your returned item, we will inspect it and notify you of the approval or rejection of your refund.
            </p>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
              <p className="text-gray-700 font-medium">Processing Time:</p>
              <p className="text-gray-600">Refunds will be processed within 5-7 business days after approval</p>
            </div>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Refund will be credited to the original payment method</li>
              <li>Shipping charges are non-refundable</li>
              <li>You will be responsible for return shipping costs</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Damaged or Defective Products</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you receive a damaged or defective product, please contact us immediately with photos of the product and packaging.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>We will arrange free pickup for damaged/defective items</li>
              <li>Full refund or replacement will be provided</li>
              <li>Report must be made within 48 hours of delivery</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Non-Returnable Items</h2>
            <p className="text-gray-700 leading-relaxed">
              The following items cannot be returned:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mt-4">
              <li>Products with broken seals or used products</li>
              <li>Products purchased during special promotional sales (unless defective)</li>
              <li>Items returned after 7 days of delivery</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Initiate a Return</h2>
            <div className="space-y-3 text-gray-700">
              <p><strong>Step 1:</strong> Contact our customer support at <a href="mailto:info@noorherbs.com" className="text-orange-600 hover:underline">info@noorherbs.com</a> or call +91-98032-73425</p>
              <p><strong>Step 2:</strong> Provide your order number and reason for return</p>
              <p><strong>Step 3:</strong> Pack the product securely in its original packaging</p>
              <p><strong>Step 4:</strong> Ship the product to our return address (provided by customer support)</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              For any questions about our refund policy, please reach out to us:
            </p>
            <div className="bg-gray-50 rounded-lg p-6 mt-4">
              <p className="text-gray-700"><strong>Email:</strong> info@noorherbs.com</p>
              <p className="text-gray-700"><strong>Phone:</strong> +91-98032-73425</p>
              <p className="text-gray-700"><strong>Address:</strong> Sultanwind Rd, Mandir Wala Bazar, Gobind Nagar, Amritsar, Punjab 143006</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}