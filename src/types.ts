export interface Listing {
  id: string;
  title: string;
  type: 'hotel' | 'restaurant';
  description: string;
  city: string;
  price: number; // Price in Pi Network coins (π)
  rating: number;
  image: string;
  amenities: string[];
  contact: string;
  reviewsCount: number;
  isCustom?: boolean; // To distinguish user-created ads
}

export interface Booking {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImage: string;
  listingType: 'hotel' | 'restaurant';
  touristName: string;
  touristPhone: string;
  bookingDate: string;
  quantity: number; // number of nights for hotel, or guests for restaurant
  totalPrice: number; // in Pi
  status: 'paid' | 'pending';
  txHash: string;
  createdAt: string;
}

export interface ServiceProviderStats {
  totalEarned: number;
  activeAds: number;
  totalBookings: number;
}
