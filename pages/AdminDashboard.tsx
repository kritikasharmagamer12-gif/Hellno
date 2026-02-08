import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../services/storage';
import { Booking, MenuItem, Review, ContactMessage, FranchiseInquiry, SiteConfig, GalleryItem } from '../types';
import { 
  LogOut, Calendar, MessageSquare, Star, FileText, Utensils, 
  Settings, Check, X, Trash2, Plus, Edit2, ShieldAlert, Save, MapPin, Phone, Image, Camera, Upload
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('bookings');
  
  // Data State
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [inquiries, setInquiries] = useState<FranchiseInquiry[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  
  // Config State
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({ 
    outlets: [], 
    phoneNumbers: [], 
    email: '', 
    images: { logo: '', aboutHero: '' } 
  });
  const [configSaved, setConfigSaved] = useState(false);

  // Menu Form State
  const [isEditingMenu, setIsEditingMenu] = useState(false);
  const [menuForm, setMenuForm] = useState<Partial<MenuItem>>({});

  // Gallery Form State
  const [galleryForm, setGalleryForm] = useState({ url: '', caption: '' });
  const [isAddingImage, setIsAddingImage] = useState(false);

  useEffect(() => {
    // Auth Check
    const token = sessionStorage.getItem('sc_admin_token');
    if (!token) {
      navigate('/admin-panel');
      return;
    }

    // Load Data
    refreshData();
  }, [navigate]);

  const refreshData = () => {
    setBookings(storage.getBookings());
    setMessages(storage.getMessages());
    setReviews(storage.getReviews());
    setInquiries(storage.getInquiries());
    setMenuItems(storage.getMenu());
    setLogs(storage.getLoginLogs());
    setSiteConfig(storage.getSiteConfig());
    setGallery(storage.getGallery());
  };

  const handleLogout = () => {
    sessionStorage.removeItem('sc_admin_token');
    navigate('/');
  };

  // --- Helper: Convert File to Base64 ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      // Size check (Limit to 1MB to save localStorage space)
      if (file.size > 1024 * 1024) {
        alert("Image is too large! Please upload an image smaller than 1MB to ensure fast loading.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          callback(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Handlers ---

  const handleBookingStatus = (id: string, status: any) => {
    const booking = bookings.find(b => b.id === id);
    if(booking) {
      storage.updateBooking({...booking, status});
      refreshData();
    }
  };

  const handleReviewAction = (id: string, action: 'approve' | 'delete') => {
    if(action === 'delete') {
      storage.deleteReview(id);
    } else {
      const review = reviews.find(r => r.id === id);
      if(review) storage.updateReview({...review, isApproved: true});
    }
    refreshData();
  };

  const handleSaveMenu = (e: React.FormEvent) => {
    e.preventDefault();
    if(menuForm.id) {
       // Edit
       const updated = menuItems.map(m => m.id === menuForm.id ? { ...m, ...menuForm } as MenuItem : m);
       storage.saveMenu(updated);
    } else {
       // Add
       const newItem: MenuItem = {
         id: Date.now().toString(),
         name: menuForm.name || '',
         price: menuForm.price || 0,
         category: (menuForm.category as any) || 'Chaap',
         description: menuForm.description || '',
         image: menuForm.image || 'https://picsum.photos/400/300',
         isChefSpecial: menuForm.isChefSpecial || false
       };
       storage.saveMenu([...menuItems, newItem]);
    }
    setIsEditingMenu(false);
    setMenuForm({});
    refreshData();
  };

  const handleDeleteMenu = (id: string) => {
    if(window.confirm('Delete this item?')) {
       storage.saveMenu(menuItems.filter(m => m.id !== id));
       refreshData();
    }
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    storage.saveSiteConfig(siteConfig);
    setConfigSaved(true);
    setTimeout(() => setConfigSaved(false), 3000);
  };

  const handleConfigChange = (type: 'outlets' | 'phoneNumbers', index: number, value: string) => {
    const newList = [...siteConfig[type]];
    newList[index] = value;
    setSiteConfig({ ...siteConfig, [type]: newList });
  };

  const addConfigItem = (type: 'outlets' | 'phoneNumbers') => {
    setSiteConfig({ ...siteConfig, [type]: [...siteConfig[type], ''] });
  };

  const removeConfigItem = (type: 'outlets' | 'phoneNumbers', index: number) => {
    const newList = siteConfig[type].filter((_, i) => i !== index);
    setSiteConfig({ ...siteConfig, [type]: newList });
  };

  const handleAddGalleryItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryForm.url) {
        alert("Please select an image first.");
        return;
    }
    const newItem: GalleryItem = {
      id: Date.now().toString(),
      url: galleryForm.url,
      caption: galleryForm.caption
    };
    storage.saveGallery([...gallery, newItem]);
    setGalleryForm({ url: '', caption: '' });
    setIsAddingImage(false);
    refreshData();
  };

  const handleDeleteGalleryItem = (id: string) => {
    if(window.confirm('Remove this image from gallery?')) {
      storage.saveGallery(gallery.filter(g => g.id !== id));
      refreshData();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gray-800 border-r border-gray-700 flex-shrink-0">
        <div className="p-6 border-b border-gray-700 flex items-center gap-3">
          <ShieldAlert className="text-red-500" />
          <h2 className="font-bold text-lg">Admin Panel</h2>
        </div>
        <nav className="p-4 space-y-2">
          {[
            { id: 'bookings', icon: Calendar, label: 'Bookings' },
            { id: 'reviews', icon: Star, label: 'Reviews' },
            { id: 'menu', icon: Utensils, label: 'Menu Mgmt' },
            { id: 'gallery', icon: Camera, label: 'Gallery' },
            { id: 'contact', icon: MessageSquare, label: 'Messages' },
            { id: 'franchise', icon: FileText, label: 'Franchise' },
            { id: 'settings', icon: Settings, label: 'Site Settings' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                activeTab === tab.id ? 'bg-brand-gold text-black font-bold' : 'text-gray-400 hover:bg-gray-700'
              }`}
            >
              <tab.icon size={18} /> {tab.label}
            </button>
          ))}
        </nav>
        <div className="p-4 mt-auto border-t border-gray-700">
           <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 hover:text-red-300">
             <LogOut size={18} /> Logout
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        
        {/* Bookings View */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">Table Reservations</h2>
            <div className="bg-gray-800 rounded-xl overflow-hidden shadow-xl">
              <table className="w-full text-left">
                <thead className="bg-gray-700 text-gray-300">
                  <tr>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Date/Time</th>
                    <th className="p-4">Guests</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {bookings.map(booking => (
                    <tr key={booking.id} className="hover:bg-gray-700/50">
                      <td className="p-4">
                        <div className="font-bold">{booking.name}</div>
                        <div className="text-sm text-gray-500">{booking.phone}</div>
                      </td>
                      <td className="p-4">{booking.date} at {booking.time}</td>
                      <td className="p-4">{booking.guests}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          booking.status === 'Confirmed' ? 'bg-green-900 text-green-300' : 
                          booking.status === 'Cancelled' ? 'bg-red-900 text-red-300' : 
                          'bg-yellow-900 text-yellow-300'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="p-4 flex gap-2">
                        <button onClick={() => handleBookingStatus(booking.id, 'Confirmed')} className="p-2 bg-green-600 rounded hover:bg-green-500"><Check size={16}/></button>
                        <button onClick={() => handleBookingStatus(booking.id, 'Cancelled')} className="p-2 bg-red-600 rounded hover:bg-red-500"><X size={16}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {bookings.length === 0 && <div className="p-8 text-center text-gray-500">No bookings yet.</div>}
            </div>
          </div>
        )}

        {/* Menu Management */}
        {activeTab === 'menu' && (
           <div className="space-y-6">
             <div className="flex justify-between items-center">
               <h2 className="text-2xl font-bold">Menu Management</h2>
               <button 
                 onClick={() => { setMenuForm({}); setIsEditingMenu(true); }}
                 className="bg-brand-gold text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2"
               >
                 <Plus size={18}/> Add Item
               </button>
             </div>

             {isEditingMenu && (
               <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mb-6 animate-fade-in">
                 <h3 className="text-lg font-bold mb-4">{menuForm.id ? 'Edit Item' : 'New Item'}</h3>
                 <form onSubmit={handleSaveMenu} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                      placeholder="Item Name" 
                      className="bg-black/50 border border-gray-600 p-2 rounded text-white"
                      value={menuForm.name || ''} 
                      onChange={e => setMenuForm({...menuForm, name: e.target.value})} 
                      required
                    />
                    <select
                      className="bg-black/50 border border-gray-600 p-2 rounded text-white"
                      value={menuForm.category || 'Chaap'}
                      onChange={e => setMenuForm({...menuForm, category: e.target.value as any})}
                    >
                      {['Chaap', 'Rolls', 'Starters', 'Combos', 'Beverages'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <input 
                      type="number" 
                      placeholder="Price" 
                      className="bg-black/50 border border-gray-600 p-2 rounded text-white"
                      value={menuForm.price || ''} 
                      onChange={e => setMenuForm({...menuForm, price: parseFloat(e.target.value)})} 
                      required
                    />
                    
                    {/* File Upload for Menu */}
                    <div className="bg-black/50 border border-gray-600 p-2 rounded flex items-center justify-between">
                       <span className="text-gray-400 text-sm truncate max-w-[150px]">
                         {menuForm.image ? 'Image Selected' : 'No Image'}
                       </span>
                       <label className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm flex items-center gap-2">
                         <Upload size={14} /> Upload
                         <input 
                           type="file" 
                           accept="image/*"
                           className="hidden"
                           onChange={(e) => handleFileUpload(e, (url) => setMenuForm({...menuForm, image: url}))}
                         />
                       </label>
                    </div>

                    {menuForm.image && (
                      <div className="col-span-2 flex justify-center py-2">
                        <img src={menuForm.image} alt="Preview" className="h-32 object-contain rounded border border-gray-600" />
                      </div>
                    )}

                    <textarea 
                      placeholder="Description" 
                      className="col-span-2 bg-black/50 border border-gray-600 p-2 rounded text-white"
                      value={menuForm.description || ''}
                      onChange={e => setMenuForm({...menuForm, description: e.target.value})}
                    />
                    <div className="col-span-2 flex items-center gap-2">
                      <input 
                        type="checkbox"
                        checked={menuForm.isChefSpecial || false}
                        onChange={e => setMenuForm({...menuForm, isChefSpecial: e.target.checked})}
                      />
                      <label>Mark as Chef's Special</label>
                    </div>
                    <div className="col-span-2 flex gap-2">
                      <button type="submit" className="bg-green-600 px-4 py-2 rounded">Save</button>
                      <button type="button" onClick={() => setIsEditingMenu(false)} className="bg-gray-600 px-4 py-2 rounded">Cancel</button>
                    </div>
                 </form>
               </div>
             )}

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.map(item => (
                  <div key={item.id} className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex gap-4">
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                    <div className="flex-1">
                       <h4 className="font-bold">{item.name}</h4>
                       <p className="text-brand-gold text-sm">₹{item.price}</p>
                       <p className="text-xs text-gray-500 mt-1">{item.category}</p>
                       <div className="flex gap-2 mt-2">
                         <button onClick={() => { setMenuForm(item); setIsEditingMenu(true); }} className="text-blue-400"><Edit2 size={14}/></button>
                         <button onClick={() => handleDeleteMenu(item.id)} className="text-red-400"><Trash2 size={14}/></button>
                       </div>
                    </div>
                  </div>
                ))}
             </div>
           </div>
        )}

        {/* Gallery Management */}
        {activeTab === 'gallery' && (
           <div className="space-y-6">
              <div className="flex justify-between items-center">
                 <h2 className="text-2xl font-bold">Gallery Management</h2>
                 <button 
                   onClick={() => setIsAddingImage(true)}
                   className="bg-brand-gold text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2"
                 >
                   <Plus size={18}/> Add Image
                 </button>
              </div>

              {isAddingImage && (
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mb-6 animate-fade-in">
                   <h3 className="text-lg font-bold mb-4">Add New Image</h3>
                   <form onSubmit={handleAddGalleryItem} className="space-y-4">
                      
                      {/* File Upload for Gallery */}
                      <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-brand-gold transition-colors">
                         {galleryForm.url ? (
                           <div className="relative inline-block">
                             <img src={galleryForm.url} alt="Preview" className="max-h-48 rounded" />
                             <button 
                               type="button" 
                               onClick={() => setGalleryForm({...galleryForm, url: ''})}
                               className="absolute -top-2 -right-2 bg-red-600 rounded-full p-1 hover:bg-red-700"
                             >
                               <X size={14} />
                             </button>
                           </div>
                         ) : (
                           <label className="cursor-pointer block w-full h-full">
                             <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                             <span className="text-gray-400 font-medium">Click to upload image</span>
                             <input 
                               type="file" 
                               accept="image/*"
                               className="hidden"
                               onChange={(e) => handleFileUpload(e, (url) => setGalleryForm({...galleryForm, url}))}
                             />
                           </label>
                         )}
                      </div>

                      <input 
                        placeholder="Caption (Optional)"
                        className="w-full bg-black/50 border border-gray-600 p-3 rounded text-white"
                        value={galleryForm.caption}
                        onChange={e => setGalleryForm({...galleryForm, caption: e.target.value})}
                      />
                      <div className="flex gap-2">
                        <button type="submit" className="bg-green-600 px-4 py-2 rounded text-white">Add to Gallery</button>
                        <button type="button" onClick={() => setIsAddingImage(false)} className="bg-gray-600 px-4 py-2 rounded text-white">Cancel</button>
                      </div>
                   </form>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {gallery.map(img => (
                   <div key={img.id} className="relative group">
                     <img src={img.url} alt={img.caption} className="w-full h-40 object-cover rounded-lg"/>
                     <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                        <p className="text-white text-sm font-bold mb-2">{img.caption}</p>
                        <button 
                          onClick={() => handleDeleteGalleryItem(img.id)}
                          className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
                        >
                          <Trash2 size={16}/>
                        </button>
                     </div>
                   </div>
                 ))}
              </div>
           </div>
        )}

        {/* Reviews Mgmt */}
        {activeTab === 'reviews' && (
           <div className="space-y-6">
              <h2 className="text-2xl font-bold">Reviews Approvals</h2>
              <div className="grid gap-4">
                 {reviews.map(review => (
                   <div key={review.id} className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex justify-between items-center">
                     <div>
                       <div className="flex items-center gap-2">
                         <h4 className="font-bold">{review.name}</h4>
                         <span className="flex text-yellow-500 text-xs">{[...Array(review.rating)].map((_,i) => <Star key={i} size={10} fill="currentColor"/>)}</span>
                       </div>
                       <p className="text-gray-400 text-sm mt-1">"{review.comment}"</p>
                       <p className="text-xs text-gray-600 mt-1">Status: {review.isApproved ? 'Public' : 'Pending'}</p>
                     </div>
                     <div className="flex gap-2">
                        {!review.isApproved && (
                          <button onClick={() => handleReviewAction(review.id, 'approve')} className="px-3 py-1 bg-green-600 rounded text-xs">Approve</button>
                        )}
                        <button onClick={() => handleReviewAction(review.id, 'delete')} className="px-3 py-1 bg-red-600 rounded text-xs">Delete</button>
                     </div>
                   </div>
                 ))}
              </div>
           </div>
        )}

        {/* Site Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-8 max-w-4xl">
             <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Site Settings</h2>
                {configSaved && <span className="text-green-500 font-bold animate-pulse">Changes Saved!</span>}
             </div>

             <form onSubmit={handleSaveConfig} className="bg-gray-800 p-8 rounded-xl border border-gray-700 space-y-8">
                
                {/* Branding Images with File Upload */}
                <div className="space-y-4">
                   <h3 className="text-lg font-bold flex items-center gap-2 border-b border-gray-700 pb-2">
                     <Image size={18} className="text-brand-gold"/> Branding Images
                   </h3>
                   
                   {/* Logo Upload */}
                   <div className="flex items-center gap-6 bg-black/30 p-4 rounded-lg">
                      <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center overflow-hidden border border-gray-600 flex-shrink-0">
                         {siteConfig.images.logo ? (
                           <img src={siteConfig.images.logo} alt="Logo" className="w-full h-full object-contain" />
                         ) : <span className="text-xs text-gray-500">No Logo</span>}
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-bold mb-2">Website Logo</label>
                        <div className="flex gap-2">
                           <label className="cursor-pointer bg-brand-gold text-black px-4 py-2 rounded font-bold hover:bg-white transition flex items-center gap-2">
                              <Upload size={16}/> Upload Logo
                              <input 
                                type="file" 
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFileUpload(e, (url) => setSiteConfig({...siteConfig, images: {...siteConfig.images, logo: url}}))}
                              />
                           </label>
                           {siteConfig.images.logo && (
                             <button 
                               type="button" 
                               onClick={() => setSiteConfig({...siteConfig, images: {...siteConfig.images, logo: ''}})}
                               className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
                             >
                               <Trash2 size={16}/>
                             </button>
                           )}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Recommended: Square PNG with transparent background.</p>
                      </div>
                   </div>

                   {/* About Hero Upload */}
                   <div className="bg-black/30 p-4 rounded-lg">
                      <label className="block text-sm font-bold mb-2">About Us Hero Image</label>
                      <div className="relative w-full h-40 bg-gray-800 rounded-lg overflow-hidden border-2 border-dashed border-gray-600 hover:border-gray-500 transition-colors">
                         {siteConfig.images.aboutHero ? (
                           <>
                             <img src={siteConfig.images.aboutHero} alt="About Hero" className="w-full h-full object-cover opacity-70" />
                             <div className="absolute inset-0 flex items-center justify-center">
                                <label className="cursor-pointer bg-black/70 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-black">
                                  <Edit2 size={16}/> Change Image
                                  <input 
                                    type="file" 
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleFileUpload(e, (url) => setSiteConfig({...siteConfig, images: {...siteConfig.images, aboutHero: url}}))}
                                  />
                                </label>
                             </div>
                           </>
                         ) : (
                           <label className="cursor-pointer absolute inset-0 flex flex-col items-center justify-center text-gray-400 hover:text-white">
                              <Upload size={32} className="mb-2"/>
                              <span>Click to Upload Hero Image</span>
                              <input 
                                type="file" 
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFileUpload(e, (url) => setSiteConfig({...siteConfig, images: {...siteConfig.images, aboutHero: url}}))}
                              />
                           </label>
                         )}
                      </div>
                   </div>
                </div>

                {/* Outlets */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-700 pb-2">
                     <h3 className="text-lg font-bold flex items-center gap-2"><MapPin size={18} className="text-brand-gold"/> Outlet Locations</h3>
                     <button type="button" onClick={() => addConfigItem('outlets')} className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded">+ Add Outlet</button>
                  </div>
                  {siteConfig.outlets.map((outlet, idx) => (
                    <div key={idx} className="flex gap-2">
                       <input 
                         className="flex-1 bg-black/50 border border-gray-600 p-3 rounded text-white"
                         value={outlet}
                         onChange={e => handleConfigChange('outlets', idx, e.target.value)}
                         placeholder="Enter full address"
                       />
                       <button type="button" onClick={() => removeConfigItem('outlets', idx)} className="text-red-400 hover:bg-red-900/30 p-2 rounded"><Trash2 size={18}/></button>
                    </div>
                  ))}
                </div>

                {/* Phones */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-700 pb-2">
                     <h3 className="text-lg font-bold flex items-center gap-2"><Phone size={18} className="text-brand-gold"/> Phone Numbers</h3>
                     <button type="button" onClick={() => addConfigItem('phoneNumbers')} className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded">+ Add Phone</button>
                  </div>
                  {siteConfig.phoneNumbers.map((phone, idx) => (
                    <div key={idx} className="flex gap-2">
                       <input 
                         className="flex-1 bg-black/50 border border-gray-600 p-3 rounded text-white"
                         value={phone}
                         onChange={e => handleConfigChange('phoneNumbers', idx, e.target.value)}
                         placeholder="Enter phone number"
                       />
                       <button type="button" onClick={() => removeConfigItem('phoneNumbers', idx)} className="text-red-400 hover:bg-red-900/30 p-2 rounded"><Trash2 size={18}/></button>
                    </div>
                  ))}
                </div>

                {/* Email */}
                <div>
                   <label className="block text-sm font-bold mb-2">Contact Email</label>
                   <input 
                      className="w-full bg-black/50 border border-gray-600 p-3 rounded text-white"
                      value={siteConfig.email}
                      onChange={e => setSiteConfig({...siteConfig, email: e.target.value})}
                   />
                </div>

                <div className="pt-4">
                   <button type="submit" className="bg-brand-gold text-black font-bold px-8 py-3 rounded-lg flex items-center gap-2 hover:bg-white transition">
                      <Save size={18}/> Save Settings
                   </button>
                </div>

             </form>
          </div>
        )}

        {/* Logs Placeholder when not active */}
        {activeTab === 'logs' && (
          <div>
             <h2 className="text-2xl font-bold mb-4">Security Logs</h2>
             <div className="bg-black/30 p-4 rounded-lg font-mono text-sm">
                {logs.map((log, i) => (
                  <div key={i} className="border-b border-gray-800 py-2">
                    <span className="text-green-500">[AUTH]</span> {log.email} accessed panel at {new Date(log.time).toLocaleString()}
                  </div>
                ))}
             </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;