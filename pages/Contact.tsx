import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send, Loader, Navigation } from 'lucide-react';
import { storage } from '../services/storage';
import { findNearestRestaurants } from '../services/geminiService';
import { GroundingChunk } from '../types';

const Contact: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  
  const config = storage.getSiteConfig();

  // Nearest Restaurant Feature State
  const [locLoading, setLocLoading] = useState(false);
  const [nearestResult, setNearestResult] = useState<{ text: string, locations: GroundingChunk[] } | null>(null);
  const [manualCity, setManualCity] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    storage.addMessage({
      id: Date.now().toString(),
      ...form,
      createdAt: new Date().toISOString(),
      read: false
    });
    setSubmitted(true);
    setForm({ name: '', email: '', phone: '', message: '' });
  };

  const handleFindNearest = async (useManual: boolean = false) => {
    setLocLoading(true);
    setNearestResult(null);

    const fetchGemini = async (lat: number, lng: number, city?: string) => {
        const result = await findNearestRestaurants(lat, lng, city);
        setNearestResult(result);
        setLocLoading(false);
    };

    if (useManual && manualCity) {
        await fetchGemini(20.5937, 78.9629, manualCity);
    } else {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser. Please enter city manually.");
            setLocLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                fetchGemini(position.coords.latitude, position.coords.longitude);
            },
            (err) => {
                console.error(err);
                alert("Location access denied. Please enter city manually.");
                setLocLoading(false);
            }
        );
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif text-brand-gold mb-4">Contact Us</h1>
          <p className="text-gray-400">Get in touch or visit our Jaipur outlets.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Form Side */}
          <div className="space-y-12">
             {/* Contact Info Cards */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 
                 {/* Addresses Card */}
                 <div className="bg-neutral-900 p-6 rounded-xl border border-gray-800 hover:border-brand-gold/50 transition duration-300">
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin className="text-brand-gold h-8 w-8" />
                      <h3 className="text-white font-bold">Our Locations</h3>
                    </div>
                    <div className="space-y-4">
                      {config.outlets.map((outlet, idx) => (
                        <div key={idx}>
                          <p className="text-brand-gold text-xs font-bold uppercase tracking-wider mb-1">Outlet {idx + 1}</p>
                          <p className="text-gray-400 text-sm">{outlet}</p>
                        </div>
                      ))}
                    </div>
                 </div>

                 {/* Phone Card */}
                 <div className="bg-neutral-900 p-6 rounded-xl border border-gray-800 hover:border-brand-gold/50 transition duration-300">
                    <div className="flex items-center gap-2 mb-4">
                      <Phone className="text-brand-gold h-8 w-8" />
                      <h3 className="text-white font-bold">Call Us</h3>
                    </div>
                    <div className="space-y-2">
                       {config.phoneNumbers.map((phone, idx) => (
                          <p key={idx} className="text-gray-400 text-sm">{phone}</p>
                       ))}
                       <p className="text-gray-500 text-xs mt-4">Email: {config.email}</p>
                    </div>
                 </div>
             </div>

             {/* Message Form */}
             <div className="bg-neutral-900 p-8 rounded-xl border border-gray-800 shadow-xl">
               <h3 className="text-2xl font-serif text-white mb-6">Send a Message</h3>
               {submitted ? (
                 <div className="text-green-500 text-center py-8 bg-green-900/10 rounded-lg animate-fade-in-up">
                   Message sent successfully! We'll get back to you.
                 </div>
               ) : (
                 <form onSubmit={handleSubmit} className="space-y-4">
                   <input 
                     type="text" 
                     placeholder="Your Name"
                     required
                     className="w-full bg-black/40 border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-brand-gold transition"
                     value={form.name}
                     onChange={e => setForm({...form, name: e.target.value})}
                   />
                   <input 
                     type="email" 
                     placeholder="Email Address"
                     required
                     className="w-full bg-black/40 border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-brand-gold transition"
                     value={form.email}
                     onChange={e => setForm({...form, email: e.target.value})}
                   />
                   <input 
                     type="tel" 
                     placeholder="Phone Number"
                     required
                     className="w-full bg-black/40 border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-brand-gold transition"
                     value={form.phone}
                     onChange={e => setForm({...form, phone: e.target.value})}
                   />
                   <textarea 
                     placeholder="Your Message"
                     required
                     rows={4}
                     className="w-full bg-black/40 border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-brand-gold transition"
                     value={form.message}
                     onChange={e => setForm({...form, message: e.target.value})}
                   ></textarea>
                   <button type="submit" className="w-full bg-brand-gold text-black font-bold py-3 rounded-lg hover:bg-white transition flex items-center justify-center gap-2 transform hover:scale-[1.02]">
                     <Send size={18} /> Send Message
                   </button>
                 </form>
               )}
             </div>
          </div>

          {/* Map & Locator Side */}
          <div className="space-y-8">
            
            {/* Embed Map */}
            <div className="h-80 w-full rounded-xl overflow-hidden border border-gray-800 shadow-xl cinematic-shadow">
               <iframe 
                 src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3557.904812345678!2d75.8323!3d26.9048!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db6f8f8f8f8f8%3A0x1234567890abcdef!2sRaja%20Park%2C%20Jaipur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin" 
                 width="100%" 
                 height="100%" 
                 style={{border:0, filter: 'grayscale(100%) invert(92%) contrast(83%)'}} 
                 allowFullScreen={true} 
                 loading="lazy"
               ></iframe>
            </div>

            {/* Find Nearest Feature */}
            <div className="bg-neutral-900 border border-brand-gold/30 p-6 rounded-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-full -mr-16 -mt-16 animate-pulse"></div>
               
               <h3 className="text-xl font-serif text-brand-gold mb-4 flex items-center gap-2">
                 <Navigation size={20} /> Find Nearest Singh's Chaap
               </h3>
               
               <div className="flex flex-col gap-4">
                  <button 
                    onClick={() => handleFindNearest(false)}
                    disabled={locLoading}
                    className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition border border-gray-700"
                  >
                    {locLoading ? <Loader className="animate-spin" size={18}/> : <MapPin size={18} />}
                    Use My Current Location
                  </button>
                  
                  <div className="flex items-center gap-2">
                    <div className="h-[1px] bg-gray-700 flex-1"></div>
                    <span className="text-xs text-gray-500">OR ENTER CITY</span>
                    <div className="h-[1px] bg-gray-700 flex-1"></div>
                  </div>

                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Enter city (e.g. Delhi)"
                      className="flex-1 bg-black/40 border border-gray-700 rounded-lg px-4 text-white outline-none focus:border-brand-gold transition"
                      value={manualCity}
                      onChange={(e) => setManualCity(e.target.value)}
                    />
                    <button 
                      onClick={() => handleFindNearest(true)}
                      disabled={locLoading || !manualCity}
                      className="bg-brand-gold text-black px-6 rounded-lg font-bold hover:bg-white disabled:opacity-50 transition"
                    >
                      Find
                    </button>
                  </div>
               </div>

               {/* Results Area */}
               {nearestResult && (
                 <div className="mt-6 pt-6 border-t border-gray-800 animate-fade-in">
                    <p className="text-gray-300 text-sm mb-4">{nearestResult.text}</p>
                    
                    {nearestResult.locations.length > 0 && (
                       <div className="space-y-3 max-h-60 overflow-y-auto">
                          {nearestResult.locations.map((loc, idx) => (
                             <div key={idx} className="bg-black/40 p-3 rounded-lg border border-gray-800 flex justify-between items-center hover:border-brand-gold/50 transition">
                                <div>
                                  <h4 className="text-brand-gold font-bold text-sm">
                                    {(loc.maps?.title || loc.web?.title || 'Found Location').substring(0, 30)}...
                                  </h4>
                                  {loc.maps?.placeAnswerSources?.[0]?.reviewSnippets?.[0]?.reviewText && (
                                     <p className="text-xs text-gray-500 mt-1 italic">
                                        "{loc.maps.placeAnswerSources[0].reviewSnippets[0].reviewText.substring(0, 50)}..."
                                     </p>
                                  )}
                                </div>
                                {(loc.maps?.uri || loc.web?.uri) && (
                                    <a 
                                      href={loc.maps?.uri || loc.web?.uri} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-xs bg-gray-800 hover:bg-brand-gold hover:text-black px-3 py-1 rounded transition"
                                    >
                                      View Map
                                    </a>
                                )}
                             </div>
                          ))}
                       </div>
                    )}
                 </div>
               )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;