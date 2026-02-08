import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { storage } from '../services/storage';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  // Retrieve logo from storage, update on location change to reflect admin edits
  const [logoUrl, setLogoUrl] = useState(storage.getSiteConfig().images.logo);

  useEffect(() => {
    setLogoUrl(storage.getSiteConfig().images.logo);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Menu', path: '/menu' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Reviews', path: '/reviews' },
    { name: 'Franchise', path: '/franchise' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed w-full z-50 bg-brand-dark/95 border-b border-brand-gold/20 backdrop-blur-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative rounded-full border-2 border-brand-gold/50 group-hover:border-brand-gold transition-colors duration-300 p-1 bg-white/5">
              <img 
                src={logoUrl} 
                alt="Singh's Chaap Logo" 
                className="h-14 w-14 md:h-16 md:w-16 object-contain transform group-hover:scale-110 transition duration-500 rounded-full" 
              />
            </div>
            <div className="flex flex-col">
              <span className="text-brand-gold font-serif text-lg md:text-xl font-bold tracking-wider group-hover:text-white transition-colors">SINGH'S CHAAP</span>
              <span className="text-gray-400 text-[8px] md:text-[10px] tracking-[0.2em] uppercase">India Official • Jaipur</span>
            </div>
          </Link>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
                    isActive(link.path)
                      ? 'text-brand-gold'
                      : 'text-gray-300 hover:text-white hover:scale-105 transform'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link 
                to="/admin-panel" 
                className="text-xs text-gray-600 hover:text-brand-gold transition-colors"
              >
                Admin
              </Link>
            </div>
          </div>
          
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-brand-dark border-b border-brand-gold/20 animate-fade-in-up">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.path)
                    ? 'text-brand-gold bg-gray-900'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
                to="/admin-panel"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-brand-gold"
              >
                Admin Login
              </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;