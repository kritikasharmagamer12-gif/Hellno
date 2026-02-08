import React, { useState } from 'react';
import { storage } from '../services/storage';
import { MenuItem } from '../types';

const Menu: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const menuItems = storage.getMenu();
  const categories = ['All', 'Chaap', 'Rolls', 'Starters', 'Combos', 'Beverages'];

  const filteredItems = activeCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-brand-dark pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif text-brand-gold mb-4">Our Menu</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Indulge in our carefully curated selection of North Indian delicacies. 
            From spicy Tandoori Chaap to refreshing beverages.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full text-sm font-bold tracking-wide transition-all duration-300 ${
                activeCategory === cat 
                  ? 'bg-brand-gold text-black shadow-lg shadow-brand-gold/20' 
                  : 'bg-neutral-800 text-gray-300 hover:bg-neutral-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-8 gap-y-12">
          {filteredItems.map((item) => (
            <div key={item.id} className="flex gap-4 md:gap-6 group">
              <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 rounded-xl overflow-hidden relative">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />
                {item.isChefSpecial && (
                  <div className="absolute top-0 left-0 bg-brand-accent text-white text-[10px] px-2 py-1 font-bold uppercase">
                    Chef's Special
                  </div>
                )}
              </div>
              <div className="flex-grow flex flex-col justify-center border-b border-gray-800 pb-4 group-hover:border-brand-gold/30 transition-colors">
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="text-xl font-serif text-white group-hover:text-brand-gold transition-colors">{item.name}</h3>
                  <span className="text-brand-gold font-bold text-lg">₹{item.price}</span>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            No items found in this category yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;