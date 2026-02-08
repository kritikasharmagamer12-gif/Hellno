export interface MenuItem {
  id: string;
  name: string;
  category: 'Chaap' | 'Rolls' | 'Starters' | 'Combos' | 'Beverages';
  description: string;
  price: number;
  image: string;
  isChefSpecial: boolean;
}

export interface Booking {
  id: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  specialRequests?: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  image?: string;
  isApproved: boolean;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface FranchiseInquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  investmentRange: string;
  message: string;
  createdAt: string;
}

export interface SiteConfig {
  outlets: string[];
  phoneNumbers: string[];
  email: string;
  images: {
    logo: string;
    aboutHero: string;
  };
}

export interface GalleryItem {
  id: string;
  url: string;
  caption: string;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
    placeAnswerSources?: {
      reviewSnippets?: {
        reviewText: string;
      }[];
    }[];
  };
}