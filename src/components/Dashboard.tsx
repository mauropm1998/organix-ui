import React from 'react';
import { User, Draft, Content } from '../types';
import { FileText, Video, CheckCircle, Clock, XCircle, PlayCircle } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { t } from '../translations';

interface DashboardProps {
  user: User;
  drafts: Draft[];
  content: Content[];
}

const Dashboard: React.FC<DashboardProps> = ({ user, drafts, content }) => {
  const { language } = useLanguage();

  // Filter data based on user role
  const userDrafts = user.adminType === 'admin' 
    ? drafts 
    : drafts.filter(d => d.creator === user.id);

  const userContent = user.adminType === 'admin'
    ? content
    : content.filter(c => c.creator === user.id || c.producer === user.id);

  // Statistics
  const draftStats = {
    total: userDrafts.length,
    approved: userDrafts.filter(d => d.status === 'approved').length,
    pending: userDrafts.filter(d => d.status === 'pending').length,
    rejected: userDrafts.filter(d => d.status === 'not approved').length
  };

  const contentStats = {
    total: userContent.length,
    inProduction: userContent.filter(c => c.status === 'in-production').length,
    pending: userContent.filter(c => c.status === 'pending').length,
    posted: userContent.filter(c => c.status === 'posted').length,
    finished: userContent.filter(c => c.status === 'finished').length
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {t('dashboard', language)}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {t('welcomeBack', language)}, {user.name}! {t('contentOverview', language)}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('totalDrafts', language)}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{draftStats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('approvedDrafts', language)}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{draftStats.approved}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
              <Video className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('totalContent', language)}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{contentStats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <PlayCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('inProduction', language)}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{contentStats.inProduction}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Drafts */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('recentDrafts', language)}</h3>
          </div>
          <div className="p-6">
            {userDrafts.slice(0, 5).map(draft => (
              <div key={draft.id} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-600 last:border-b-0">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">{draft.name}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{draft.type}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  draft.status === 'approved' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : draft.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {t(draft.status as any, language)}
                </span>
              </div>
            ))}
            {userDrafts.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">{t('noDraftsYet', language)}</p>
            )}
          </div>
        </div>

        {/* Recent Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('recentContent', language)}</h3>
          </div>
          <div className="p-6">
            {userContent.slice(0, 5).map(item => (
              <div key={item.id} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-600 last:border-b-0">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.type}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
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
              </div>
            ))}
            {userContent.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">{t('noContentYet', language)}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;