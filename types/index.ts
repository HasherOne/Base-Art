
export interface User {
  id: string;
  name: string;
  username: string;
  bio: string;
  avatar: string;
  verified: boolean;
  followers: number;
  following: number;
  walletAddress: string;
  balance: string;
  joinedDate: string;
}

export interface Artwork {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  price: string;
  image: string;
  category: string;
  verified: boolean;
  likes: number;
  description?: string;
  royalties?: number;
  status: 'available' | 'sold' | 'auction' | 'listed';
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  dimensions?: {
    width: number;
    height: number;
  };
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  items: number;
  floorPrice: string;
  change: string;
  image: string;
  verified: boolean;
  creatorId: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: 'like' | 'purchase' | 'sale' | 'follow' | 'bid' | 'auction_end';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  userId: string;
  relatedId?: string;
  image?: string;
}

export interface Activity {
  id: string;
  type: 'purchase' | 'sale' | 'listing' | 'bid' | 'transfer';
  title: string;
  price: string;
  time: string;
  icon: string;
  userId: string;
  artworkId?: string;
  fromUser?: string;
  toUser?: string;
}

export interface Bid {
  id: string;
  artworkId: string;
  userId: string;
  amount: string;
  timestamp: string;
  status: 'active' | 'outbid' | 'won' | 'cancelled';
}

export interface Auction {
  id: string;
  artworkId: string;
  startPrice: string;
  currentBid: string;
  highestBidder?: string;
  startTime: string;
  endTime: string;
  status: 'active' | 'ended' | 'cancelled';
  bids: Bid[];
}

export interface WalletInfo {
  address: string;
  balance: string;
  network: string;
  provider: string;
  connected: boolean;
  connectedAt: string;
}

export interface NotificationPreferences {
  newArtworks: boolean;
  priceAlerts: boolean;
  auctionUpdates: boolean;
  marketingEmails: boolean;
  weeklyDigest: boolean;
}

export interface EmailSubscription {
  email: string;
  preferences: NotificationPreferences;
  subscribedAt: string;
  verified: boolean;
}

export interface WalletProvider {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  supported: boolean;
}
