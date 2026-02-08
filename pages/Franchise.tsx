import React, { useState } from 'react';
import { storage } from '../services/storage';

const Franchise: React.FC = () => {
  const [form, setForm] = useState({
    name: '', phone: '', email: '', city: '', investmentRange: '5-10 Lakhs', message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    storage.addInquiry({
      id: Date.now().toString(),
      ...form,
      createdAt: new Date().toISOString()
    });
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-brand-dark pt-28 pb-16 bg-[url('https://picsum.photos/1920/1080?grayscale&blur=2')] bg-cover bg-fixed">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-black/90 p-8 md:p-12 rounded-2xl border border-brand-gold/30 shadow-2xl backdrop-blur-md">
           <div className="text-center mb-10">
             <h1 className="text-3xl md:text-4xl font-serif text-brand-gold mb-2">Partner With Us</h1>
             <p className="text-gray-400">Join the growing family of Singh's Chaap India</p>
           </div>

           {submitted ? (
             <div className="text-center py-12">
               <h3 className="text-2xl text-white font-bold mb-4">Thank You for Your Interest!</h3>
               <p className="text-gray-300">Our franchise team will review your details and contact you within 48 hours.</p>
             </div>
           ) : (
             <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Full Name</label>
                    <input 
                       required
                       className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white focus:border-brand-gold outline-none"
                       value={form.name}
                       onChange={e => setForm({...form, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Phone</label>
                    <input 
                       required
                       type="tel"
                       className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white focus:border-brand-gold outline-none"
                       value={form.phone}
                       onChange={e => setForm({...form, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                    <label className="block text-gray-400 text-sm mb-1">Email</label>
                    <input 
                       required
                       type="email"
                       className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white focus:border-brand-gold outline-none"
                       value={form.email}
                       onChange={e => setForm({...form, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">City</label>
                    <input 
                       required
                       className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white focus:border-brand-gold outline-none"
                       value={form.city}
                       onChange={e => setForm({...form, city: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                   <label className="block text-gray-400 text-sm mb-1">Investment Capacity</label>
                   <select 
                     className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white focus:border-brand-gold outline-none"
                     value={form.investmentRange}
                     onChange={e => setForm({...form, investmentRange: e.target.value})}
                   >
                     <option>5-10 Lakhs</option>
                     <option>10-20 Lakhs</option>
                     <option>20-30 Lakhs</option>
                     <option>30 Lakhs+</option>
                   </select>
                </div>

                <div>
                   <label className="block text-gray-400 text-sm mb-1">Message / Query</label>
                   <textarea 
                     rows={4}
                     className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white focus:border-brand-gold outline-none"
                     value={form.message}
                     onChange={e => setForm({...form, message: e.target.value})}
                   />
                </div>

                <button type="submit" className="w-full bg-brand-gold text-black font-bold py-4 rounded-lg hover:bg-white transition">
                  Apply for Franchise
                </button>
             </form>
           )}
        </div>
      </div>
    </div>
  );
};

export default Franchise;