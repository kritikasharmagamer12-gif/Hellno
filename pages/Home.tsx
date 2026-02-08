import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ArrowRight, CheckCircle } from 'lucide-react';
import { storage } from '../services/storage';
import { Booking } from '../types';

const Home: React.FC = () => {
  const [bookingForm, setBookingForm] = useState({
    name: '', phone: '', date: '', time: '', guests: 2, specialRequests: ''
  });
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'success'>('idle');
  
  // Get approved reviews for display (limit 3)
  const reviews = storage.getReviews().filter(r => r.isApproved).slice(0, 3);
  const logoUrl = storage.getSiteConfig().images.logo;

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBooking: Booking = {
      id: Date.now().toString(),
      ...bookingForm,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    storage.addBooking(newBooking);
    setBookingStatus('success');
    setBookingForm({ name: '', phone: '', date: '', time: '', guests: 2, specialRequests: '' });
    setTimeout(() => setBookingStatus('idle'), 5000);
  };

  return (
    <div className="min-h-screen bg-brand-dark">
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 md:pt-0">
        {/* Placeholder Video Background */}
        <video 
          className="video-bg" 
          autoPlay 
          muted 
          loop 
          poster="https://picsum.photos/1920/1080"
          playsInline
        >
          <source src="https://videos.pexels.com/video-files/3008953/3008953-uhd_2560_1440_24fps.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto space-y-6 animate-fade-in-up flex flex-col items-center">
          
          {/* Spiritual Greeting - Adjusted for Mobile Visibility */}
          <div className="mb-4 animate-pulse-glow w-full">
            <h2 className="text-4xl md:text-6xl font-serif font-extrabold text-brand-saffron drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-wide">
              🕉️ JAI SHREE RAM 🔱
            </h2>
          </div>

          <div className="w-48 h-48 mx-auto bg-black/40 rounded-full flex items-center justify-center backdrop-blur-md mb-2 border-2 border-brand-gold/50 shadow-2xl cinematic-shadow transform hover:scale-105 transition duration-700">
             <img 
                src={logoUrl} 
                alt="Singh's Chaap Logo" 
                className="w-40 h-40 object-contain drop-shadow-xl rounded-full"
             />
          </div>
          
          <h1 className="text-5xl md:text-8xl font-serif font-bold text-white tracking-tight drop-shadow-2xl">
            Singh's Chaap <span className="text-brand-gold">India</span>
          </h1>
          
          <p className="text-xl md:text-3xl text-gray-200 font-light tracking-wide drop-shadow-md bg-black/30 inline-block px-4 py-1 rounded-lg backdrop-blur-sm">
            Authentic North Indian Chaap & Rolls | Jaipur
          </p>

          {/* Punchline */}
          <div className="py-6">
             <p className="text-2xl md:text-5xl font-serif text-brand-saffron font-bold italic drop-shadow-[0_2px_4px_rgba(0,0,0,1)] -rotate-1 transform hover:rotate-0 transition duration-300">
               "Chaap nahi khaya to Chatta khayega kya?"
             </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 pt-6">
            <Link to="/menu" className="bg-brand-gold text-black px-10 py-4 rounded-full font-bold text-lg hover:bg-white hover:scale-105 transition duration-300 shadow-[0_0_20px_rgba(212,175,55,0.5)]">
              View Menu
            </Link>
            <a href="#book-table" className="border-2 border-white text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-black hover:scale-105 transition duration-300 backdrop-blur-sm">
              Book a Table
            </a>
          </div>
        </div>
        
        <div className="absolute bottom-10 animate-bounce-slow text-white/50 hidden md:block">
           <ArrowRight className="h-10 w-10 rotate-90" />
        </div>
      </section>

      {/* Highlights */}
      <section className="py-20 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          {[
            { title: "Pure Veg", icon: "🌱", desc: "100% Vegetarian Delights" },
            { title: "Famous Chaap", icon: "🔥", desc: "Signature Smoky Flavors" },
            { title: "Hygienic", icon: "✨", desc: "Open, Clean Kitchen" },
            { title: "Affordable", icon: "💰", desc: "Premium Taste, Best Price" }
          ].map((item, idx) => (
            <div key={idx} className="p-6 bg-brand-dark rounded-xl border border-gray-800 hover:border-brand-gold/50 transition duration-300 group hover:-translate-y-2 hover:shadow-[0_0_15px_rgba(212,175,55,0.2)]">
              <div className="text-4xl mb-4 transform group-hover:scale-110 transition duration-300">{item.icon}</div>
              <h3 className="text-xl font-bold text-brand-gold mb-2">{item.title}</h3>
              <p className="text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Booking Form */}
      <section id="book-table" className="py-24 relative bg-cover bg-center bg-fixed" style={{backgroundImage: 'url("https://picsum.photos/1920/1080?grayscale")'}}>
        <div className="absolute inset-0 bg-black/80"></div>
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <div className="bg-brand-dark/90 p-8 md:p-12 rounded-2xl border border-brand-gold/30 shadow-2xl backdrop-blur-sm">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-serif font-bold text-brand-gold mb-2">Reserve Your Table</h2>
              <p className="text-gray-400">Experience the finest dining in Jaipur</p>
            </div>

            {bookingStatus === 'success' ? (
              <div className="text-center py-10">
                <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="text-white h-10 w-10" />
                </div>
                <h3 className="text-2xl text-white font-bold mb-2">Booking Requested!</h3>
                <p className="text-gray-300">We will call you shortly to confirm your reservation.</p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                    <input 
                      required
                      type="text" 
                      className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-brand-gold outline-none focus:ring-1 focus:ring-brand-gold transition"
                      value={bookingForm.name}
                      onChange={e => setBookingForm({...bookingForm, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Phone Number</label>
                    <input 
                      required
                      type="tel" 
                      className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-brand-gold outline-none focus:ring-1 focus:ring-brand-gold transition"
                      value={bookingForm.phone}
                      onChange={e => setBookingForm({...bookingForm, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Date</label>
                    <input 
                      required
                      type="date" 
                      className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-brand-gold outline-none focus:ring-1 focus:ring-brand-gold transition"
                      value={bookingForm.date}
                      onChange={e => setBookingForm({...bookingForm, date: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Time</label>
                    <input 
                      required
                      type="time" 
                      className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-brand-gold outline-none focus:ring-1 focus:ring-brand-gold transition"
                      value={bookingForm.time}
                      onChange={e => setBookingForm({...bookingForm, time: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                   <label className="block text-sm text-gray-400 mb-1">Number of Guests</label>
                   <select 
                      className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-brand-gold outline-none focus:ring-1 focus:ring-brand-gold transition"
                      value={bookingForm.guests}
                      onChange={e => setBookingForm({...bookingForm, guests: parseInt(e.target.value)})}
                   >
                     {[1,2,3,4,5,6,7,8,9,10,12,15,20].map(n => (
                       <option key={n} value={n}>{n} Guests</option>
                     ))}
                   </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Special Requests (Optional)</label>
                  <textarea 
                    rows={3}
                    className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-brand-gold outline-none focus:ring-1 focus:ring-brand-gold transition"
                    value={bookingForm.specialRequests}
                    onChange={e => setBookingForm({...bookingForm, specialRequests: e.target.value})}
                  ></textarea>
                </div>
                <button type="submit" className="w-full bg-brand-gold hover:bg-yellow-500 text-black font-bold py-4 rounded-lg transition duration-300 transform hover:scale-[1.02]">
                  Confirm Booking
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Order Online CTA */}
      <section className="py-20 bg-brand-dark border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-serif text-white mb-8">Order From Home</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <a href="https://www.swiggy.com" target="_blank" rel="noopener noreferrer" className="bg-[#fc8019] text-white px-8 py-4 rounded-xl font-bold hover:opacity-90 transition flex items-center justify-center gap-2 hover:scale-105 duration-300">
              Order on Swiggy
            </a>
            <a href="https://www.zomato.com" target="_blank" rel="noopener noreferrer" className="bg-[#cb202d] text-white px-8 py-4 rounded-xl font-bold hover:opacity-90 transition flex items-center justify-center gap-2 hover:scale-105 duration-300">
              Order on Zomato
            </a>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-24 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif text-brand-gold mb-2">Guest Reviews</h2>
              <p className="text-gray-400">What Jaipur is saying about us</p>
            </div>
            <Link to="/reviews" className="text-brand-gold border-b border-brand-gold pb-1 hover:text-white transition">View All</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <div key={review.id} className="bg-brand-dark p-6 rounded-xl border border-gray-800 shadow-lg hover:border-brand-gold/30 transition duration-300">
                <div className="flex text-brand-gold mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-gray-600"} />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic">"{review.comment}"</p>
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-xs font-bold text-gray-400">
                     {review.name.charAt(0)}
                   </div>
                   <div>
                     <p className="text-white font-bold text-sm">{review.name}</p>
                     <p className="text-xs text-gray-500">Verified Customer</p>
                   </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/reviews" className="inline-block border border-gray-600 px-8 py-3 rounded-full text-gray-300 hover:border-brand-gold hover:text-brand-gold transition">
              Write a Review
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;