import { MenuItem, Booking, Review, ContactMessage, FranchiseInquiry, SiteConfig, GalleryItem } from '../types';

// Initial Seed Data
const INITIAL_MENU: MenuItem[] = [
  { id: '1', name: 'Malai Chaap', category: 'Chaap', description: 'Creamy, rich soy chaap marinated in mild spices.', price: 220, image: 'https://picsum.photos/400/300?random=1', isChefSpecial: true },
  { id: '2', name: 'Masala Chaap', category: 'Chaap', description: 'Spicy and tangy chaap cooked in tandoor.', price: 200, image: 'https://picsum.photos/400/300?random=2', isChefSpecial: false },
  { id: '3', name: 'Paneer Tikka Roll', category: 'Rolls', description: 'Fresh paneer cubes wrapped in crispy paratha.', price: 150, image: 'https://picsum.photos/400/300?random=3', isChefSpecial: false },
  { id: '4', name: 'Afghani Chaap', category: 'Chaap', description: 'White gravy chaap with cashew paste.', price: 240, image: 'https://picsum.photos/400/300?random=4', isChefSpecial: true },
  { id: '5', name: 'Virgin Mojito', category: 'Beverages', description: 'Refreshing mint and lemon cooler.', price: 120, image: 'https://picsum.photos/400/300?random=5', isChefSpecial: false },
];

const INITIAL_REVIEWS: Review[] = [
  { id: '1', name: 'Rahul S.', rating: 5, comment: 'Best Chaap in Jaipur! The Malai Chaap is a must-try.', isApproved: true, createdAt: new Date().toISOString() },
  { id: '2', name: 'Priya M.', rating: 4, comment: 'Great ambience and lovely food. Service was a bit slow but worth the wait.', isApproved: true, createdAt: new Date().toISOString() },
];

const INITIAL_CONFIG: SiteConfig = {
  outlets: [
    "Shop No. 12, Raja Park Main Market, Jaipur, Rajasthan 302004",
    "Plot 45, Lane 7, Malviya Nagar, Jaipur, Rajasthan 302017"
  ],
  phoneNumbers: [
    "+91 98765 43210",
    "+91 91234 56789"
  ],
  email: "contact@singhschaap.com",
  images: {
    logo: "https://drive.google.com/uc?export=view&id=1QaSaxWTrxGn8r3zOjDDf7XKbbmTmakbR",
    aboutHero: "https://picsum.photos/1200/600?grayscale"
  }
};

const INITIAL_GALLERY: GalleryItem[] = Array.from({ length: 6 }).map((_, i) => ({
  id: i.toString(),
  url: `https://picsum.photos/600/600?random=${i+10}`,
  caption: i % 2 === 0 ? 'Delicious Food' : 'Restaurant Ambience'
}));

// Helper to get/set
const get = <T>(key: string, initial: T): T => {
  const stored = localStorage.getItem(key);
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(stored);
};

const set = <T>(key: string, data: T) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const storage = {
  // Menu
  getMenu: () => get<MenuItem[]>('sc_menu', INITIAL_MENU),
  saveMenu: (items: MenuItem[]) => set('sc_menu', items),

  // Bookings
  getBookings: () => get<Booking[]>('sc_bookings', []),
  addBooking: (booking: Booking) => {
    const bookings = get<Booking[]>('sc_bookings', []);
    set('sc_bookings', [booking, ...bookings]);
  },
  updateBooking: (updated: Booking) => {
    const bookings = get<Booking[]>('sc_bookings', []);
    set('sc_bookings', bookings.map(b => b.id === updated.id ? updated : b));
  },

  // Reviews
  getReviews: () => get<Review[]>('sc_reviews', INITIAL_REVIEWS),
  addReview: (review: Review) => {
    const reviews = get<Review[]>('sc_reviews', INITIAL_REVIEWS);
    set('sc_reviews', [review, ...reviews]);
  },
  updateReview: (updated: Review) => {
    const reviews = get<Review[]>('sc_reviews', INITIAL_REVIEWS);
    set('sc_reviews', reviews.map(r => r.id === updated.id ? updated : r));
  },
  deleteReview: (id: string) => {
    const reviews = get<Review[]>('sc_reviews', INITIAL_REVIEWS);
    set('sc_reviews', reviews.filter(r => r.id !== id));
  },

  // Contact
  getMessages: () => get<ContactMessage[]>('sc_messages', []),
  addMessage: (msg: ContactMessage) => {
    const msgs = get<ContactMessage[]>('sc_messages', []);
    set('sc_messages', [msg, ...msgs]);
  },

  // Franchise
  getInquiries: () => get<FranchiseInquiry[]>('sc_franchise', []),
  addInquiry: (inquiry: FranchiseInquiry) => {
    const items = get<FranchiseInquiry[]>('sc_franchise', []);
    set('sc_franchise', [inquiry, ...items]);
  },
  
  // Site Config (Admin Managed)
  getSiteConfig: () => get<SiteConfig>('sc_config', INITIAL_CONFIG),
  saveSiteConfig: (config: SiteConfig) => set('sc_config', config),

  // Gallery
  getGallery: () => get<GalleryItem[]>('sc_gallery', INITIAL_GALLERY),
  saveGallery: (items: GalleryItem[]) => set('sc_gallery', items),

  // Login Logs
  getLoginLogs: () => get<{email: string, time: string}[]>('sc_logs', []),
  addLoginLog: (email: string) => {
    const logs = get<{email: string, time: string}[]>('sc_logs', []);
    set('sc_logs', [{email, time: new Date().toISOString()}, ...logs]);
  }
};