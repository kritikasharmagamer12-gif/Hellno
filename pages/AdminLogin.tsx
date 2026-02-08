import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../services/storage';
import { Lock } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Strict Access Control
    if (email.trim().toLowerCase() === 'singhschaap.india@gmail.com') {
      sessionStorage.setItem('sc_admin_token', 'secure_token_' + Date.now());
      storage.addLoginLog(email);
      navigate('/admin-panel/dashboard');
    } else {
      setError('Access Denied. You are not authorized to view this page.');
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-neutral-900 p-8 rounded-2xl border border-gray-800 shadow-2xl cinematic-shadow">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="text-brand-gold h-8 w-8" />
          </div>
          <h1 className="text-2xl font-serif text-white font-bold">Admin Portal</h1>
          <p className="text-gray-500 text-sm">Restricted Access • Owners Only</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-900/20 border border-red-900 text-red-400 p-3 rounded text-sm text-center">
              {error}
            </div>
          )}
          
          <div>
             <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">Google Email</label>
             <input 
               type="email" 
               required
               className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold"
               placeholder="Enter authorized Gmail..."
               value={email}
               onChange={e => setEmail(e.target.value)}
             />
          </div>

          <button 
            type="submit" 
            className="w-full bg-brand-gold text-black font-bold py-3 rounded-lg hover:bg-white transition duration-300"
          >
            Authenticate
          </button>
        </form>
        
        <div className="mt-6 text-center text-xs text-gray-600">
          <p>IP Address Logged for Security</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;