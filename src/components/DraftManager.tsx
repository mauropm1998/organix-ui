import React, { useState } from 'react';
import { User, Draft } from '../types';
import { Plus, Edit, Trash2, CheckCircle, Clock, XCircle } from 'lucide-react';
import { CONTENT_TYPES, DRAFT_STATUSES } from '../data/mockData';
import { useLanguage } from '../hooks/useLanguage';
import { t } from '../translations';

interface DraftManagerProps {
  user: User;
  drafts: Draft[];
  users: User[];
  onAddDraft: (draft: Omit<Draft, 'id' | 'createdAt'>) => void;
  onUpdateDraft: (id: string, updates: Partial<Draft>) => void;
  onDeleteDraft: (id: string) => void;
}

const DraftManager: React.FC<DraftManagerProps> = ({
  user,
  drafts,
  users,
  onAddDraft,
  onUpdateDraft,
  onDeleteDraft
}) => {
  const { language } = useLanguage();
  const [showForm, setShowForm] = useState(false);
  const [editingDraft, setEditingDraft] = useState<Draft | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    richtext: '',
    status: 'pending' as const
  });

  // Filter drafts based on user role
  const userDrafts = user.adminType === 'admin' 
    ? drafts 
    : drafts.filter(d => d.creator === user.id);

  // Apply filters
  const filteredDrafts = userDrafts.filter(draft => {
    if (filterStatus && draft.status !== filterStatus) return false;
    if (filterType && draft.type !== filterType) return false;
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingDraft) {
      onUpdateDraft(editingDraft.id, formData);
      setEditingDraft(null);
    } else {
      onAddDraft({
        ...formData,
        creator: user.id
      });
    }
    
    setFormData({ name: '', type: '', richtext: '', status: 'pending' });
    setShowForm(false);
  };

  const handleEdit = (draft: Draft) => {
    setEditingDraft(draft);
    setFormData({
      name: draft.name,
      type: draft.type,
      richtext: draft.richtext,
      status: draft.status
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingDraft(null);
    setFormData({ name: '', type: '', richtext: '', status: 'pending' });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'not approved':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const canEdit = (draft: Draft) => {
    return user.adminType === 'admin' || draft.creator === user.id;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('drafts', language)}</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('newDraft', language)}
        </button>
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">{t('allStatuses', language)}</option>
          {DRAFT_STATUSES.map(status => (
            <option key={status} value={status}>{t(status as any, language)}</option>
          ))}
        </select>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">{t('allTypes', language)}</option>
          {CONTENT_TYPES.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* Draft Form */}
      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {editingDraft ? t('editDraft', language) : t('createNewDraft', language)}
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
            
            {user.adminType === 'admin' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('status', language)}
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  {DRAFT_STATUSES.map(status => (
                    <option key={status} value={status}>{t(status as any, language)}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('draftContent', language)}
              </label>
              <textarea
                value={formData.richtext}
                onChange={(e) => setFormData({ ...formData, richtext: e.target.value })}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder={t('enterDraftContent', language)}
                required
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                {editingDraft ? t('update', language) : t('create', language)} {t('drafts', language)}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition-colors"
              >
                {t('cancel', language)}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Drafts List */}
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
                  {t('creator', language)}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('status', language)}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('created', language)}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('actions', language)}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredDrafts.map(draft => {
                const creator = users.find(u => u.id === draft.creator);
                return (
                  <tr key={draft.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {draft.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {draft.type}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {creator?.name || 'Unknown'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(draft.status)}
                        <span className={`text-sm font-medium ${
                          draft.status === 'approved' 
                            ? 'text-green-600 dark:text-green-400'
                            : draft.status === 'pending'
                            ? 'text-yellow-600 dark:text-yellow-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {t(draft.status as any, language)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {draft.createdAt.toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {canEdit(draft) && (
                          <button
                            onClick={() => handleEdit(draft)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                        {canEdit(draft) && (
                          <button
                            onClick={() => onDeleteDraft(draft.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            title="Delete draft"
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
          {filteredDrafts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">{t('noDraftsFound', language)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DraftManager;