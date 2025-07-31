export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  adminType: 'admin' | 'operator';
  companyId: string;
}

export interface Company {
  id: string;
  name: string;
  createdAt: Date;
  adminId: string;
}

export interface Draft {
  id: string;
  name: string;
  type: string;
  creator: string; // User ID
  richtext: string;
  status: 'approved' | 'pending' | 'not approved';
  createdAt: Date;
  companyId: string;
}

export interface Product {
  id: string;
  name: string;
  companyId: string;
}

export interface Content {
  id: string;
  name: string;
  type: string;
  product: string; // Product ID
  creator: string; // User ID
  creationDate: Date;
  postDate: Date;
  producer: string; // User ID
  status: 'pending' | 'canceled' | 'posted' | 'in-production' | 'finished';
  channels: string[];
  companyId: string;
  metrics?: ContentMetrics;
}

export interface ContentMetrics {
  views: number;
  likes: number;
  reach: number;
  engagement: number;
  comments: number;
  shares: number;
  channelMetrics?: {
    [channel: string]: {
      likes: number;
      comments: number;
      shares: number;
      postClicks: number;
      siteVisits: number;
      newAccounts: number;
    };
  };
}

export interface AuthContextType {
  user: User | null;
  company: Company | null;
  login: (email: string, password: string) => boolean;
  signUp: (companyData: Omit<Company, 'id' | 'createdAt'>, adminData: Omit<User, 'id' | 'companyId'>) => boolean;
  logout: () => void;
}

export type FilterType = {
  status?: string;
  type?: string;
  channel?: string;
  dateRange?: { start: Date; end: Date };
  product?: string;
  user?: string;
};