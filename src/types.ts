export type CategoryType = 
  | 'hotel'
  | 'apartment'
  | 'restaurant'
  | 'attraction'
  | 'car_rental'
  | 'tour_guide'
  | 'agency'
  | 'transport'
  | 'activity'
  | 'cruise';

export interface Review {
  id: string;
  listingId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1-5
  comment: string;
  date: string;
  photos?: string[];
}

export interface Listing {
  id: string;
  title: string;
  titleEn?: string;
  type: CategoryType;
  description: string;
  descriptionEn?: string;
  city: string;
  cityEn?: string;
  price: number; // Price in Pi Network coins (π)
  rating: number;
  image: string;
  images?: string[]; // Multiple photos gallery
  amenities: string[];
  contact: string;
  reviewsCount: number;
  isCustom?: boolean; // User-created ads
  isFeatured?: boolean; // Featured on home page
  status?: 'approved' | 'pending' | 'rejected'; // For admin moderation
  isActive?: boolean; // Enabled/disabled
  lat?: number; // Map coordinates
  lng?: number;
  ownerName?: string;
  ownerPiUser?: string;
  createdAt?: string;
}

export interface Booking {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImage: string;
  listingType: CategoryType;
  touristName: string;
  touristPhone: string;
  bookingDate: string;
  quantity: number; // number of nights, guests, days, or tickets
  totalPrice: number; // in Pi
  platformFee: number; // Pi commission
  providerAmount: number; // Pi net to provider
  status: 'paid' | 'pending' | 'cancelled' | 'completed';
  txHash: string;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  title: string;
  titleEn?: string;
  message: string;
  messageEn?: string;
  date: string;
  read: boolean;
  type: 'booking' | 'payment' | 'offer' | 'system';
}

export interface PlatformSettings {
  commissionPercentage: number; // e.g. 5 for 5%
  requireAdApproval: boolean;
  platformWalletAddress: string;
}

export interface ServiceProviderStats {
  totalEarned: number;
  netEarned: number;
  activeAds: number;
  totalBookings: number;
}

