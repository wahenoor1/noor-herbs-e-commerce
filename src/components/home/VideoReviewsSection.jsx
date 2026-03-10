import React from 'react';
import { motion } from "framer-motion";
import { Play } from "lucide-react";

const videos = [
  { id: "WVvOAac8W9w", title: "Sea Buckthorn Benefits" },
  { id: "LGGJ-asDx1g", title: "Sea Buckthorn Review" },
  { id: "emvg2MSOMgQ", title: "Health Benefits" },
  { id: "TGmyUxNwHYY", title: "Customer Review" }
];

export default function VideoReviewsSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="inline-block px-4 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium mb-4">
            <Play className="w-4 h-4 inline mr-1" />
            Video Reviews
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Sea Buckthorn Benefits & Reviews
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Watch what experts and customers say about Sea Buckthorn - The Wonder Berry from Ladakh
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="aspect-[9/16] rounded-2xl overflow-hidden bg-gray-100 shadow-lg hover:shadow-xl transition-shadow"
            >
              <iframe 
                src={`https://www.youtube.com/embed/${video.id}?origin=${window.location.origin}`}
                title={video.title}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}