import React from 'react';
import { Facebook, Instagram, Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { storage } from '../services/storage';

const Footer: React.FC = () => {
  // Fetch dynamic config
  const config = storage.getSiteConfig();

  return (
    <footer className="bg-black text-white pt-16 pb-8 border-t border-brand-gold/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-serif text-brand-gold font-bold">Singh's Chaap India</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Authentic North Indian delicacies served with love. Experience the royal taste of Jaipur's finest Chaap and Rolls.
            </p>
            <div className="flex space-x-4 pt-4">
              <a href="#" className="text-gray-400 hover:text-brand-gold transition"><Facebook size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-brand-gold transition"><Instagram size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-white uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/menu" className="hover:text-brand-gold">Menu</Link></li>
              <li><Link to="/book-table" className="hover:text-brand-gold">Book a Table</Link></li>
              <li><Link to="/franchise" className="hover:text-brand-gold">Franchise Inquiry</Link></li>
              <li><Link to="/contact" className="hover:text-brand-gold">Contact Us</Link></li>
              <li><Link to="/admin-panel" className="hover:text-brand-gold">Staff Login</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-white uppercase tracking-wider">Our Outlets</h4>
            <div className="space-y-3 text-sm text-gray-400">
              
              {config.outlets.map((outlet, idx) => (
                <div key={idx} className="flex items-start">
                  <MapPin size={18} className="mr-2 text-brand-gold flex-shrink-0 mt-1" />
                  <span>{outlet}</span>
                </div>
              ))}

              <div className="pt-2 border-t border-gray-800 mt-2"></div>

              {config.phoneNumbers.map((phone, idx) => (
                <p key={idx} className="flex items-center">
                  <Phone size={18} className="mr-2 text-brand-gold" />
                  <span>{phone}</span>
                </p>
              ))}
              
              <p className="flex items-center">
                <Mail size={18} className="mr-2 text-brand-gold" />
                <span>{config.email}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Singh's Chaap India Official. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;