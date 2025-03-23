'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: string;
}

interface GalleryContent {
  title: string;
  description: string;
  categories: string[];
  images: GalleryImage[];
}

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState<GalleryContent | null>(null);

  // Fetch content from JSON file
  useEffect(() => {
    async function fetchContent() {
      try {
        // Add timestamp to prevent caching
        const response = await fetch(`/data/gallery-content.json?t=${new Date().getTime()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch content');
        }
        const data = await response.json();
        setContent(data);
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchContent();
  }, []);

  // If content is not loaded, return loading component
  if (!content && !isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Error</h1>
          <p className="mt-2 text-gray-600">Failed to load gallery content</p>
        </div>
      </div>
    );
  }

  const filteredImages = !content ? [] : selectedCategory === 'All'
    ? content.images
    : content.images.filter(img => img.category === selectedCategory);

  // Count images per category
  const categoryCounts = !content ? [] : content.categories.map(category => {
    if (category === 'All') {
      return content.images.length;
    }
    return content.images.filter(img => img.category === category).length;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#1D942C]/5">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full bg-[#ffc500] blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-20" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-[#1D942C] blur-[100px] translate-y-1/2 -translate-x-1/2 opacity-20" />
        </motion.div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {content?.title || 'Our Gallery'}
            <span className="text-[#1D942C] relative ml-3">
              <motion.span 
                className="absolute bottom-2 left-0 w-full h-3 bg-[#ffc500]/40 -z-10"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.8, delay: 0.5 }}
              />
            </span>
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {content?.description || 'Explore our gallery of impactful moments'}
          </motion.p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <motion.div 
          className="flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {content?.categories.map((category, index) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`h-12 px-6 rounded-full text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                selectedCategory === category
                  ? 'bg-[#1D942C] text-white shadow-lg shadow-[#1D942C]/20'
                  : 'bg-white/80 text-gray-600 hover:bg-[#1D942C]/10 hover:text-[#1D942C]'
              }`}
            >
              <span>{category}</span>
              <span className={`inline-flex items-center justify-center min-w-6 h-6 px-1.5 rounded-full text-xs ${
                selectedCategory === category
                  ? 'bg-white text-[#1D942C]'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {categoryCounts[index]}
              </span>
            </button>
          ))}
        </motion.div>
      </section>

      {/* Gallery Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <div 
                key={index}
                className="relative w-full h-80 rounded-2xl overflow-hidden bg-gray-200 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            layout
          >
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="relative w-full h-80 rounded-2xl overflow-hidden cursor-pointer group shadow-lg"
                onClick={() => setSelectedImage(image.id)}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <span className="inline-block px-3 py-1 bg-[#1D942C] text-white text-xs font-medium rounded-full mb-2">
                    {image.category}
                  </span>
                  <div className="text-lg font-semibold">{image.alt}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
        
        {!isLoading && filteredImages.length === 0 && (
          <div className="text-center py-20">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No images found</h3>
            <p className="text-gray-600">No images available in the selected category.</p>
          </div>
        )}
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && content && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-7xl w-full max-h-[90vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 text-white/80 hover:text-white z-10"
                onClick={() => setSelectedImage(null)}
              >
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden">
                <Image
                  src={content.images.find(img => img.id === selectedImage)?.src || ''}
                  alt={content.images.find(img => img.id === selectedImage)?.alt || ''}
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              <div className="absolute bottom-4 left-4 text-white bg-black/50 backdrop-blur-sm p-4 rounded-lg">
                <div className="text-sm font-medium text-[#ffc500] mb-1">
                  {content.images.find(img => img.id === selectedImage)?.category}
                </div>
                <div className="text-xl font-semibold">
                  {content.images.find(img => img.id === selectedImage)?.alt}
                </div>
              </div>

              {/* Navigation Buttons */}
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-black/30 hover:bg-black/50 rounded-full p-3 transition-all duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  const currentIndex = filteredImages.findIndex(img => img.id === selectedImage);
                  const prevImage = filteredImages[currentIndex - 1];
                  if (prevImage) setSelectedImage(prevImage.id);
                  else setSelectedImage(filteredImages[filteredImages.length - 1].id); // Loop to the last image
                }}
              >
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-black/30 hover:bg-black/50 rounded-full p-3 transition-all duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  const currentIndex = filteredImages.findIndex(img => img.id === selectedImage);
                  const nextImage = filteredImages[currentIndex + 1];
                  if (nextImage) setSelectedImage(nextImage.id);
                  else setSelectedImage(filteredImages[0].id); // Loop to the first image
                }}
              >
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
