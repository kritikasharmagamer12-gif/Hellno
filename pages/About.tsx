import React from 'react';
import { storage } from '../services/storage';

const About: React.FC = () => {
  const aboutImage = storage.getSiteConfig().images.aboutHero;

  return (
    <div className="min-h-screen bg-brand-dark pt-28 pb-16">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-serif text-brand-gold mb-8">Our Story</h1>
        
        <div className="space-y-8 text-lg text-gray-300 leading-relaxed font-light">
          <p>
            Welcome to <strong className="text-white">Singh's Chaap India</strong>, where tradition meets taste in every bite. 
            Born in the heart of Jaipur, we started with a simple vision: to serve the most authentic, mouth-watering North Indian Chaap and Rolls 
            without compromising on hygiene or quality.
          </p>
          
          <div className="aspect-video rounded-xl overflow-hidden my-12 shadow-2xl border border-gray-800">
            <img src={aboutImage} alt="Restaurant Interior" className="w-full h-full object-cover hover:scale-105 transition duration-700" />
          </div>

          <p>
            Our secret lies in our spices. Hand-picked and ground in-house, our masalas bring out the rich, smoky flavors that define true 
            North Indian cuisine. Whether it's our creamy Malai Chaap or the fiery Masala Tikka, every dish is prepared fresh, ensuring 
            a royal experience for your palate.
          </p>

          <h2 className="text-2xl font-serif text-white mt-12 mb-4">Why We Are Special</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
            <li className="flex items-center gap-3">
              <span className="text-brand-gold text-xl">✓</span> 100% Pure Vegetarian Kitchen
            </li>
            <li className="flex items-center gap-3">
              <span className="text-brand-gold text-xl">✓</span> Fresh Soya Chaap (No Maida)
            </li>
            <li className="flex items-center gap-3">
              <span className="text-brand-gold text-xl">✓</span> Traditional Clay Oven (Tandoor)
            </li>
            <li className="flex items-center gap-3">
              <span className="text-brand-gold text-xl">✓</span> Family Friendly Atmosphere
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;