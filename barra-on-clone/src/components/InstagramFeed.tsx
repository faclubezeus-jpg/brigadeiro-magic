import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Heart, MessageCircle } from 'lucide-react';

const instagramPosts = [
  { id: 1, image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=300', likes: '2.4k', comments: '85' },
  { id: 2, image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&q=80&w=300', likes: '1.8k', comments: '42' },
  { id: 3, image: 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?auto=format&fit=crop&q=80&w=300', likes: '3.1k', comments: '120' },
  { id: 4, image: 'https://images.unsplash.com/photo-1611162616485-9681e3ec359d?auto=format&fit=crop&q=80&w=300', likes: '1.2k', comments: '30' },
];

const InstagramFeed: React.FC = () => {
  return (
    <section id="instagram" className="py-24 relative overflow-hidden">
      <div className="container">
        <div className="flex flex-col items-center mb-12">
          <Instagram className="w-12 h-12 text-[#bd00ff] mb-4" />
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-center">
            NOSSO <span className="gradient-text">FEED</span> NO INSTA
          </h2>
          <a 
            href="https://instagram.com/barraon_" 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-4 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
          >
            @barraon_ <Instagram className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {instagramPosts.map((post, index) => (
            <motion.a
              key={post.id}
              href="https://instagram.com/barraon_"
              target="_blank"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative aspect-square group overflow-hidden rounded-2xl"
            >
              <img 
                src={post.image} 
                alt="Instagram post" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6">
                <div className="flex items-center gap-1 font-bold">
                  <Heart className="w-5 h-5 fill-white" /> {post.likes}
                </div>
                <div className="flex items-center gap-1 font-bold">
                  <MessageCircle className="w-5 h-5 fill-white" /> {post.comments}
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstagramFeed;
