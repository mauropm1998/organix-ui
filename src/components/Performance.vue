<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-900">Performance Analytics</h2>
      <div class="flex space-x-4">
        <select v-model="selectedTimeframe" class="px-3 py-2 border border-gray-300 rounded-md">
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
        <select v-model="selectedChannel" class="px-3 py-2 border border-gray-300 rounded-md">
          <option value="all">All Channels</option>
          <option value="instagram">Instagram</option>
          <option value="facebook">Facebook</option>
          <option value="twitter">Twitter</option>
          <option value="linkedin">LinkedIn</option>
          <option value="tiktok">TikTok</option>
          <option value="youtube">YouTube</option>
        </select>
      </div>
    </div>

    <!-- Key Metrics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="metric in keyMetrics" :key="metric.name" class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <component :is="metric.icon" class="h-8 w-8 text-indigo-600" />
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">{{ metric.name }}</dt>
              <dd class="text-lg font-medium text-gray-900">{{ metric.value }}</dd>
            </dl>
          </div>
        </div>
        <div class="mt-4">
          <div class="flex items-center text-sm">
            <component :is="metric.trend === 'up' ? 'TrendingUp' : 'TrendingDown'" 
                       :class="metric.trend === 'up' ? 'text-green-500' : 'text-red-500'" 
                       class="h-4 w-4 mr-1" />
            <span :class="metric.trend === 'up' ? 'text-green-600' : 'text-red-600'">
              {{ metric.change }}
            </span>
            <span class="text-gray-500 ml-1">vs last period</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Engagement Chart -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Engagement Over Time</h3>
        <div class="h-64 flex items-center justify-center bg-gray-50 rounded">
          <p class="text-gray-500">Chart visualization would go here</p>
        </div>
      </div>

      <!-- Channel Performance -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Channel Performance</h3>
        <div class="space-y-4">
          <div v-for="channel in channelPerformance" :key="channel.name" class="flex items-center">
            <div class="flex-shrink-0 w-12">
              <component :is="channel.icon" class="h-6 w-6 text-gray-600" />
            </div>
            <div class="flex-1 ml-4">
              <div class="flex items-center justify-between">
                <p class="text-sm font-medium text-gray-900">{{ channel.name }}</p>
                <p class="text-sm text-gray-500">{{ channel.engagement }}</p>
              </div>
              <div class="mt-1 w-full bg-gray-200 rounded-full h-2">
                <div class="bg-indigo-600 h-2 rounded-full" :style="{ width: channel.percentage + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Top Performing Content -->
    <div class="bg-white rounded-lg shadow">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">Top Performing Content</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Channel</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Likes</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comments</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shares</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Engagement Rate</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="content in topContent" :key="content.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ content.title }}</div>
                <div class="text-sm text-gray-500">{{ content.date }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="getChannelBadgeClass(content.channel)">
                  {{ content.channel }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ content.likes }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ content.comments }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ content.shares }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ content.engagementRate }}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Eye, 
  TrendingUp, 
  TrendingDown,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Music,
  Youtube
} from 'lucide-vue-next';


const props = defineProps({
  content: Array
});

const selectedTimeframe = ref('30d');
const selectedChannel = ref('all');

const keyMetrics = computed(() => [
  {
    name: 'Total Likes',
    value: '12.4K',
    change: '+12%',
    trend: 'up',
    icon: Heart
  },
  {
    name: 'Comments',
    value: '2.1K',
    change: '+8%',
    trend: 'up',
    icon: MessageCircle
  },
  {
    name: 'Shares',
    value: '856',
    change: '-3%',
    trend: 'down',
    icon: Share2
  },
  {
    name: 'Reach',
    value: '45.2K',
    change: '+15%',
    trend: 'up',
    icon: Eye
  }
]);

const channelPerformance = computed(() => [
  { name: 'Instagram', engagement: '4.2K', percentage: 85, icon: Instagram },
  { name: 'Facebook', engagement: '3.1K', percentage: 65, icon: Facebook },
  { name: 'Twitter', engagement: '2.8K', percentage: 58, icon: Twitter },
  { name: 'LinkedIn', engagement: '1.9K', percentage: 42, icon: Linkedin },
  { name: 'TikTok', engagement: '1.5K', percentage: 35, icon: Music },
  { name: 'YouTube', engagement: '1.2K', percentage: 28, icon: Youtube }
]);

const topContent = computed(() => [
  {
    id: 1,
    title: 'Summer Collection Launch',
    date: '2024-01-15',
    channel: 'Instagram',
    likes: 1250,
    comments: 89,
    shares: 45,
    engagementRate: 8.2
  },
  {
    id: 2,
    title: 'Behind the Scenes Video',
    date: '2024-01-14',
    channel: 'TikTok',
    likes: 980,
    comments: 156,
    shares: 78,
    engagementRate: 7.8
  },
  {
    id: 3,
    title: 'Product Tutorial',
    date: '2024-01-13',
    channel: 'YouTube',
    likes: 756,
    comments: 234,
    shares: 123,
    engagementRate: 7.1
  },
  {
    id: 4,
    title: 'Customer Testimonial',
    date: '2024-01-12',
    channel: 'Facebook',
    likes: 645,
    comments: 67,
    shares: 34,
    engagementRate: 6.9
  },
  {
    id: 5,
    title: 'Industry Insights',
    date: '2024-01-11',
    channel: 'LinkedIn',
    likes: 423,
    comments: 89,
    shares: 156,
    engagementRate: 6.5
  }
]);

const getChannelBadgeClass = (channel) => {
  const classes = {
    Instagram: 'bg-pink-100 text-pink-800',
    Facebook: 'bg-blue-100 text-blue-800',
    Twitter: 'bg-sky-100 text-sky-800',
    LinkedIn: 'bg-indigo-100 text-indigo-800',
    TikTok: 'bg-purple-100 text-purple-800',
    YouTube: 'bg-red-100 text-red-800'
  };
  return classes[channel] || 'bg-gray-100 text-gray-800';
};
</script>