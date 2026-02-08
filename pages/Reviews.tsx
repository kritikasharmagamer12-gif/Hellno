import React, { useState } from 'react';
import { storage } from '../services/storage';
import { Star } from 'lucide-react';

const Reviews: React.FC = () => {
  const [reviews] = useState(storage.getReviews().filter(r => r.isApproved));
  const [form, setForm] = useState({ name: '', rating: 5, comment: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    storage.addReview({
      id: Date.now().toString(),
      ...form,
      isApproved: false, // Pending approval
      createdAt: new Date().toISOString()
    });
    setSubmitted(true);
    setForm({ name: '', rating: 5, comment: '' });
  };

  return (
    <div className="min-h-screen bg-brand-dark pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* Review List */}
        <div className="md:col-span-2 space-y-8">
          <h1 className="text-4xl font-serif text-brand-gold mb-8">Customer Stories</h1>
          {reviews.length === 0 ? (
            <p className="text-gray-500">No reviews yet. Be the first!</p>
          ) : (
            reviews.map(review => (
              <div key={review.id} className="bg-neutral-900 p-6 rounded-xl border border-gray-800">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-white font-bold text-lg">{review.name}</h3>
                    <div className="flex text-yellow-500 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-gray-600"} />
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-300 italic leading-relaxed">"{review.comment}"</p>
              </div>
            ))
          )}
        </div>

        {/* Form */}
        <div>
          <div className="bg-neutral-900 p-8 rounded-xl border border-brand-gold/20 sticky top-28">
            <h3 className="text-2xl font-serif text-white mb-6">Write a Review</h3>
            {submitted ? (
              <div className="text-green-500 text-center bg-green-900/10 p-4 rounded">
                Thanks! Your review has been submitted for approval.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Name</label>
                  <input 
                    required 
                    className="w-full bg-black/50 border border-gray-700 rounded p-2 text-white outline-none focus:border-brand-gold"
                    value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Rating</label>
                  <div className="flex gap-2">
                    {[1,2,3,4,5].map(star => (
                      <button 
                        key={star}
                        type="button"
                        onClick={() => setForm({...form, rating: star})}
                        className={`transition ${form.rating >= star ? 'text-yellow-500' : 'text-gray-600'}`}
                      >
                        <Star fill={form.rating >= star ? "currentColor" : "none"} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Review</label>
                  <textarea 
                    required 
                    rows={4}
                    className="w-full bg-black/50 border border-gray-700 rounded p-2 text-white outline-none focus:border-brand-gold"
                    value={form.comment}
                    onChange={e => setForm({...form, comment: e.target.value})}
                  />
                </div>
                <button type="submit" className="w-full bg-brand-gold text-black font-bold py-3 rounded hover:bg-white transition">
                  Submit Review
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Reviews;