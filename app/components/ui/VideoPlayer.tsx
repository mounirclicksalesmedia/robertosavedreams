'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface VideoPlayerProps {
  videoSrc: string;
  thumbnailSrc: string;
  thumbnailAlt: string;
  className?: string;
}

export default function VideoPlayer({ videoSrc, thumbnailSrc, thumbnailAlt, className = '' }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className={`relative aspect-video rounded-2xl overflow-hidden shadow-xl ${className}`}>
      {/* Video */}
      <video 
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src={videoSrc}
        controls={isPlaying}
        playsInline
        onEnded={() => setIsPlaying(false)}
      />
      
      {/* Thumbnail overlay (shown when video is not playing) */}
      {!isPlaying && (
        <div className="absolute inset-0">
          <Image
            src={thumbnailSrc}
            alt={thumbnailAlt}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
          
          {/* Centered play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-20 h-20 rounded-full bg-[#ffc500] flex items-center justify-center shadow-lg transform hover:shadow-xl transition-all duration-300"
              onClick={handlePlayClick}
              aria-label="Play video"
            >
              <svg className="w-8 h-8 text-[#1D942C] transform translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
} 