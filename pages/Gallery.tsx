import React from 'react';
import { storage } from '../services/storage';

const Gallery: React.FC = () => {
  const images = storage.getGallery();

  return (
    <div className="min-h-screen bg-brand-dark pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-serif text-brand-gold text-center mb-12">Gallery</h1>
        
        {images.length === 0 ? (
          <div className="text-center text-gray-500 py-20">
            <p>No images in gallery yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((img) => (
              <div key={img.id} className="relative group overflow-hidden rounded-lg aspect-square cursor-pointer">
                <img 
                  src={img.url} 
                  alt={img.caption} 
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-110 group-hover:opacity-75"
                />
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                  <span className="text-white font-serif italic text-lg">{img.caption}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;