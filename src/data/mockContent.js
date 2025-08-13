export const mockContent = [
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
    metrics: { views: 1000, likes: 100, reach: 2000, engagement: 50, comments: 10, shares: 20 }
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
    metrics: { views: 2000, likes: 200, reach: 3000, engagement: 100, comments: 20, shares: 40 }
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
    metrics: { views: 3000, likes: 300, reach: 4000, engagement: 150, comments: 30, shares: 60 }
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
    metrics: { views: 4000, likes: 400, reach: 5000, engagement: 200, comments: 40, shares: 80 }
  }
];
