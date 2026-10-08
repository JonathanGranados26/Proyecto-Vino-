'use client';

import { useState } from 'react';

interface ProductGalleryProps {
  imageUrl: string | null;
  name: string;
}

export function ProductGallery({ imageUrl, name }: ProductGalleryProps) {
  const [isZoomed, setIsZoomed] = useState(false);

  if (!imageUrl) {
    return (
      <div className="bg-gray-100 rounded-2xl overflow-hidden h-[500px] lg:h-[600px] flex items-center justify-center">
        <div className="text-gray-400 text-center">
          <div className="text-6xl mb-4">🍷</div>
          <p>Sin imagen disponible</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      <div
        className={`bg-gray-50 rounded-2xl overflow-hidden shadow-sm border border-gray-100 transition-transform duration-300 ${
          isZoomed ? 'scale-105 cursor-zoom-out' : 'cursor-zoom-in'
        }`}
        onClick={() => setIsZoomed(!isZoomed)}
      >
        <img
          src={imageUrl}
          alt={name}
          className={`w-full h-[500px] lg:h-[600px] object-cover transition-transform duration-500 ${
            isZoomed ? 'scale-150' : 'scale-100'
          }`}
        />
      </div>
      
      {/* Zoom indicator */}
      <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition">
        {isZoomed ? '🔍 Clic para alejar' : ' Clic para zoom'}
      </div>
    </div>
  );
}