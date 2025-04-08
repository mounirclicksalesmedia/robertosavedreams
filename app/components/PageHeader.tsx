'use client';

import React from 'react';
import Image from 'next/image';

interface PageHeaderProps {
  title: string;
  description: string;
  image: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description, image }) => {
  return (
    <section className="relative py-20 bg-primary overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
          {title}
        </h1>
        <p className="text-xl text-white/90 max-w-3xl mx-auto">
          {description}
        </p>
      </div>
    </section>
  );
};

export default PageHeader; 