import { User, Draft, Product, Content, Company, ContentMetrics } from '../types';

export const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'Organix Demo Company',
    createdAt: new Date('2024-01-01'),
    adminId: '1'
  }
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@organix.com',
    password: 'admin123',
    adminType: 'admin',
    companyId: '1'
  },
  {
    id: '2',
    name: 'John Operator',
    email: 'john@organix.com',
    password: 'operator123',
    adminType: 'operator',
    companyId: '1'
  },
  {
    id: '3',
    name: 'Sarah Operator',
    email: 'sarah@organix.com',
    password: 'operator123',
    adminType: 'operator',
    companyId: '1'
  }
];

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Product Alpha',
    companyId: '1'
  },
  {
    id: '2',
    name: 'Product Beta',
    companyId: '1'
  },
  {
    id: '3',
    name: 'Product Gamma',
    companyId: '1'
  }
];

export const mockDrafts: Draft[] = [
  {
    id: '1',
    name: 'Summer Campaign Draft',
    type: 'Marketing Campaign',
    creator: '2',
    richtext: '<p>This is a comprehensive summer marketing campaign focusing on outdoor activities and lifestyle products.</p>',
    status: 'pending',
    createdAt: new Date('2024-01-15'),
    companyId: '1'
  },
  {
    id: '2',
    name: 'Product Launch Content',
    type: 'Product Announcement',
    creator: '3',
    richtext: '<p>Exciting new product launch announcement with detailed feature highlights and benefits.</p>',
    status: 'approved',
    createdAt: new Date('2024-01-20'),
    companyId: '1'
  },
  {
    id: '3',
    name: 'Social Media Series',
    type: 'Social Content',
    creator: '2',
    richtext: '<p>A series of engaging social media posts designed to increase brand awareness and engagement.</p>',
    status: 'not approved',
    createdAt: new Date('2024-01-25'),
    companyId: '1'
  }
];

const generateMockMetrics = (): ContentMetrics => ({
  views: Math.floor(Math.random() * 10000) + 1000,
  likes: Math.floor(Math.random() * 1000) + 100,
  reach: Math.floor(Math.random() * 15000) + 2000,
  engagement: Math.floor(Math.random() * 500) + 50,
  comments: Math.floor(Math.random() * 200) + 10,
  shares: Math.floor(Math.random() * 300) + 20
});

export const mockContent: Content[] = [
  {
    id: '1',
    name: 'Holiday Campaign',
    type: 'Marketing Campaign',
    product: '1',
    creator: '2',
    creationDate: new Date('2024-01-10'),
    postDate: new Date('2024-02-01'),
    producer: '2',
    status: 'in-production',
    channels: ['Instagram', 'Facebook', 'TikTok'],
    companyId: '1',
    metrics: generateMockMetrics()
  },
  {
    id: '2',
    name: 'Product Beta Launch',
    type: 'Product Announcement',
    product: '2',
    creator: '3',
    creationDate: new Date('2024-01-18'),
    postDate: new Date('2024-02-15'),
    producer: '3',
    status: 'pending',
    channels: ['LinkedIn', 'YouTube'],
    companyId: '1',
    metrics: generateMockMetrics()
  },
  {
    id: '3',
    name: 'Spring Collection Teaser',
    type: 'Marketing Campaign',
    product: '1',
    creator: '2',
    creationDate: new Date('2024-02-01'),
    postDate: new Date('2024-03-01'),
    producer: '2',
    status: 'posted',
    channels: ['Instagram', 'TikTok'],
    companyId: '1',
    metrics: generateMockMetrics()
  },
  {
    id: '4',
    name: 'Customer Success Story',
    type: 'Social Content',
    product: '3',
    creator: '3',
    creationDate: new Date('2024-02-10'),
    postDate: new Date('2024-02-28'),
    producer: '3',
    status: 'finished',
    channels: ['LinkedIn', 'Facebook'],
    companyId: '1',
    metrics: generateMockMetrics()
  }
];

export const CHANNELS = ['TikTok', 'Facebook', 'Instagram', 'LinkedIn', 'YouTube'];
export const CONTENT_TYPES = ['Marketing Campaign', 'Product Announcement', 'Social Content', 'Blog Post', 'Video Content'];
export const DRAFT_STATUSES = ['approved', 'pending', 'not approved'];
export const CONTENT_STATUSES = ['pending', 'canceled', 'posted', 'in-production', 'finished'];