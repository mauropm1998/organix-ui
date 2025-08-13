import React, { useState } from 'react';
import { User, Content, Product, Draft } from '../types';
import { Plus, Edit, Trash2, ArrowRightCircle, Box, BarChart3 } from 'lucide-react';
import { CONTENT_TYPES, CONTENT_STATUSES, CHANNELS } from '../data/mockData';
import { useLanguage } from '../hooks/useLanguage';
import { t } from '../translations';

interface ContentManagerProps {
  user: User;
  content: Content[];
  products: Product[];
  users: User[];
  drafts: Draft[];
  onAddContent: (content: Omit<Content, 'id' | 'creationDate'>) => void;
  onUpdateContent: (id: string, updates: Partial<Content>) => void;
  onDeleteContent: (id: string) => void;
  onTransformDraft: (draftId: string, contentData: Omit<Content, 'id' | 'creationDate' | 'name' | 'type'>) => void;
}

const ContentManager: React.FC<ContentManagerProps> = ({
  user,
  content,
  products,
  users,
  drafts,
  onAddContent,
  onUpdateContent,
  onDeleteContent,
  onTransformDraft
}) => {
  const { language } = useLanguage();
  const [showForm, setShowForm] = useState(false);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [showMetricsModal, setShowMetricsModal] = useState(false);
  const [selectedContentForMetrics, setSelectedContentForMetrics] = useState<Content | null>(null);
  const [showTransformModal, setShowTransformModal] = useState(false);
  const [selectedDraft, setSelectedDraft] = useState<Draft | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterChannel, setFilterChannel] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    product: '',
    creator: user.id,
    postDate: '',
    producer: user.id,
    status: 'pending' as const,
    channels: [] as string[]
  });
  const [channelMetrics, setChannelMetrics] = useState<{
    [channel: string]: {
      likes: number;
      comments: number;
      shares: number;
      postClicks: number;
    };
  }>({});

  // Filter content based on user role
  const userContent = user.adminType === 'admin'
    ? content
    : content.filter(c => c.creator === user.id || c.producer === user.id);

  // Get approved drafts for transformation
  const approvedDrafts = user.adminType === 'admin'
    ? drafts.filter(d => d.status === 'approved')
    : drafts.filter(d => d.status === 'approved' && d.creator === user.id);

  // Apply filters
  const filteredContent = userContent.filter(item => {
    if (filterStatus && item.status !== filterStatus) return false;
    if (filterChannel && !item.channels.includes(filterChannel)) return false;
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const contentData = {
      ...formData,
      postDate: new Date(formData.postDate)
    };
    
    if (editingContent) {
      onUpdateContent(editingContent.id, contentData);
      setEditingContent(null);
    } else {
      onAddContent(contentData);
    }
    
    resetForm();
  };

  const handleTransform = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDraft) return;

    const contentData = {
      product: formData.product,
      creator: formData.creator,
      postDate: new Date(formData.postDate),
      producer: formData.producer,
      status: formData.status,
      channels: formData.channels
    };

    onTransformDraft(selectedDraft.id, contentData);
    setShowTransformModal(false);
    setSelectedDraft(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: '',
      product: '',
      creator: user.id,
      postDate: '',
      producer: user.id,
      status: 'pending',
      channels: []
    });
    setShowForm(false);
  };

  const handleEdit = (item: Content) => {
    setEditingContent(item);
    setFormData({
      name: item.name,
      type: item.type,
      product: item.product,
      creator: item.creator,
      postDate: item.postDate.toISOString().split('T')[0],
      producer: item.producer,
      status: item.status,
      channels: item.channels
    });
    setShowForm(true);
  };

  const handleChannelChange = (channel: string, checked: boolean) => {
    if (checked) {
      setFormData({ ...formData, channels: [...formData.channels, channel] });
    } else {
      setFormData({ ...formData, channels: formData.channels.filter(c => c !== channel) });
    }
  };

  const canEdit = (item: Content) => {
    return user.adminType === 'admin' || item.creator === user.id || item.producer === user.id;
  };

  const canUpdateStatus = (item: Content) => {
    return user.adminType === 'admin' || item.producer === user.id;
  };

  const handleOpenMetricsModal = (item: Content) => {
    setSelectedContentForMetrics(item);
    const initialMetrics: { [channel: string]: { likes: number; comments: number; shares: number; postClicks: number; } } = {};
    
    item.channels.forEach(channel => {
      initialMetrics[channel] = item.metrics?.channelMetrics?.[channel] || {
        likes: 0,
        comments: 0,
        shares: 0,
        postClicks: 0,
        siteVisits: 0,
        newAccounts: 0
      };
    });
    
    setChannelMetrics(initialMetrics);
    setShowMetricsModal(true);
  };

  const handleSaveChannelMetrics = () => {
    if (!selectedContentForMetrics) return;

    const updatedMetrics = {
      ...selectedContentForMetrics.metrics,
      channelMetrics: channelMetrics
    };

    onUpdateContent(selectedContentForMetrics.id, { metrics: updatedMetrics });
    setShowMetricsModal(false);
    setSelectedContentForMetrics(null);
    setChannelMetrics({});
  };

  const updateChannelMetric = (channel: string, metric: string, value: number) => {
    setChannelMetrics(prev => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        [metric]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('content', language)}</h2>
        <div className="flex space-x-3">
          {approvedDrafts.length > 0 && (
            <button
              onClick={() => setShowTransformModal(true)}
              className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <ArrowRightCircle className="w-4 h-4 mr-2" />
              {t('transformDraft', language)}
            </button>
          )}
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t('newContent', language)}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">{t('allStatuses', language)}</option>
          {CONTENT_STATUSES.map(status => (
            <option key={status} value={status}>{t(status as any, language)}</option>
          ))}
        </select>
        <select
          value={filterChannel}
          onChange={(e) => setFilterChannel(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">{t('allChannels', language)}</option>
          {CHANNELS.map(channel => (
            <option key={channel} value={channel}>{channel}</option>
          ))}
        </select>
      </div>

      {/* Transform Draft Modal */}
      {showTransformModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('transformDraftToContent', language)}
              </h3>
              <form onSubmit={handleTransform} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('selectDraft', language)}
                  </label>
                  <select
                    value={selectedDraft?.id || ''}
                    onChange={(e) => setSelectedDraft(approvedDrafts.find(d => d.id === e.target.value) || null)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="">{t('selectApprovedDraft', language)}</option>
                    {approvedDrafts.map(draft => (
                      <option key={draft.id} value={draft.id}>{draft.name} - {draft.type}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('product', language)}
                    </label>
                    <select
                      value={formData.product}
                      onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      required
                    >
                      <option value="">{t('product', language)}</option>
                      {products.map(product => (
                        <option key={product.id} value={product.id}>{product.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('postDate', language)}
                    </label>
                    <input
                      type="date"
                      value={formData.postDate}
                      onChange={(e) => setFormData({ ...formData, postDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('producer', language)}
                    </label>
                    <select
                      value={formData.producer}
                      onChange={(e) => setFormData({ ...formData, producer: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      required
                    >
                      {users.map(user => (
                        <option key={user.id} value={user.id}>{user.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('status', language)}
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      {CONTENT_STATUSES.map(status => (
                        <option key={status} value={status}>{t(status as any, language)}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('channels', language)}
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {CHANNELS.map(channel => (
                      <label key={channel} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.channels.includes(channel)}
                          onChange={(e) => handleChannelChange(channel, e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{channel}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    {t('transformToContent', language)}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowTransformModal(false);
                      setSelectedDraft(null);
                      resetForm();
                    }}
                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition-colors"
                  >
                    {t('cancel', language)}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Content Form */}
      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {editingContent ? t('editContent', language) : t('createNewContent', language)}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('name', language)}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('type', language)}
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">{t('type', language)}</option>
                  {CONTENT_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('product', language)}
                </label>
                <select
                  value={formData.product}
                  onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">{t('product', language)}</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>{product.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('postDate', language)}
                </label>
                <input
                  type="date"
                  value={formData.postDate}
                  onChange={(e) => setFormData({ ...formData, postDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('creator', language)}
                </label>
                <select
                  value={formData.creator}
                  onChange={(e) => setFormData({ ...formData, creator: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                  disabled={user.adminType !== 'admin'}
                >
                  {users.map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('producer', language)}
                </label>
                <select
                  value={formData.producer}
                  onChange={(e) => setFormData({ ...formData, producer: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                >
                  {users.map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('status', language)}
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  {CONTENT_STATUSES.map(status => (
                    <option key={status} value={status}>{t(status as any, language)}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('channels', language)}
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {CHANNELS.map(channel => (
                  <label key={channel} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.channels.includes(channel)}
                      onChange={(e) => handleChannelChange(channel, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{channel}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                {editingContent ? t('update', language) : t('create', language)} {t('content', language)}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingContent(null);
                  resetForm();
                }}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition-colors"
              >
                {t('cancel', language)}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Channel Metrics Modal */}
      {showMetricsModal && selectedContentForMetrics && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Update Channel Metrics - {selectedContentForMetrics.name}
              </h3>
              
              <div className="space-y-6">
                {selectedContentForMetrics.channels.map(channel => (
                  <div key={channel} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                      {channel} Metrics
                    </h4>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Likes
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={channelMetrics[channel]?.likes || 0}
                          onChange={(e) => updateChannelMetric(channel, 'likes', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Comments
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={channelMetrics[channel]?.comments || 0}
                          onChange={(e) => updateChannelMetric(channel, 'comments', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Shares
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={channelMetrics[channel]?.shares || 0}
                          onChange={(e) => updateChannelMetric(channel, 'shares', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Site Visits
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={channelMetrics[channel]?.siteVisits || 0}
                          onChange={(e) => updateChannelMetric(channel, 'siteVisits', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          New Accounts
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={channelMetrics[channel]?.newAccounts || 0}
                          onChange={(e) => updateChannelMetric(channel, 'newAccounts', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Post Clicks
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={channelMetrics[channel]?.postClicks || 0}
                          onChange={(e) => updateChannelMetric(channel, 'postClicks', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleSaveChannelMetrics}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Save Metrics
                </button>
                <button
                  onClick={() => {
                    setShowMetricsModal(false);
                    setSelectedContentForMetrics(null);
                    setChannelMetrics({});
                  }}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('name', language)}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('type', language)}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('product', language)}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('status', language)}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('channels', language)}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('postDate', language)}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('actions', language)}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredContent.map(item => {
                const product = products.find(p => p.id === item.product);
                const creator = users.find(u => u.id === item.creator);
                const producer = users.find(u => u.id === item.producer);
                return (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        by {creator?.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {item.type}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {product?.name || 'Unknown'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {canUpdateStatus(item) ? (
                        <select
                          value={item.status}
                          onChange={(e) => onUpdateContent(item.id, { status: e.target.value as any })}
                          className={`text-sm rounded-full px-2 py-1 border-0 ${
                            item.status === 'posted' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : item.status === 'in-production'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              : item.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              : item.status === 'finished'
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}
                        >
                          {CONTENT_STATUSES.map(status => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      ) : (
                        <span className={`text-sm rounded-full px-2 py-1 ${
                          item.status === 'posted' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : item.status === 'in-production'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : item.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : item.status === 'finished'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {t(item.status as any, language)}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {item.channels.map(channel => (
                          <span key={channel} className="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded">
                            {channel}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {item.postDate.toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Producer: {producer?.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {(item.status === 'posted' || item.status === 'finished') && (
                          <button
                            onClick={() => handleOpenMetricsModal(item)}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                            title="Update channel metrics"
                          >
                            <BarChart3 className="w-4 h-4" />
                          </button>
                        )}
                        {canEdit(item) && (
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                        {canEdit(item) && (
                          <button
                            onClick={() => onDeleteContent(item.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            title="Delete content"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredContent.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">{t('noContentFound', language)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentManager;