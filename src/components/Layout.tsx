import React from 'react';
import { User, Company } from '../types';
import { Sun, Moon, LogOut, Home, FileText, Video, Package, Users, Calendar, BarChart3, Languages } from 'lucide-react';
import { useLanguage, Language } from '../hooks/useLanguage';
import { t } from '../translations';

interface LayoutProps {
  user: User;
  company: Company;
  onLogout: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({
  user,
  company,
  onLogout,
  theme,
  onToggleTheme,
  activeTab,
  onTabChange,
  children
}) => {
  const { language, toggleLanguage } = useLanguage();

  const navItems = [
    { id: 'dashboard', label: t('dashboard', language), icon: Home },
    { id: 'drafts', label: t('drafts', language), icon: FileText },
    { id: 'content', label: t('content', language), icon: Video },
    { id: 'calendar', label: t('calendar', language), icon: Calendar },
    { id: 'performance', label: t('performance', language), icon: BarChart3 },
    { id: 'products', label: t('products', language), icon: Package },
    ...(user.adminType === 'admin' ? [{ id: 'users', label: t('users', language), icon: Users }] : [])
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {company.name}
              </h1>
              <h2 className="ml-4 text-lg text-gray-600 dark:text-gray-400">
                Organix
              </h2>
              <span className="ml-3 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                {t(user.adminType as any, language)}
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {user.name}
              </span>
              <button
                onClick={toggleLanguage}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title={language === 'en' ? 'Português' : 'English'}
              >
                <Languages className="w-5 h-5" />
              </button>
              <button
                onClick={onToggleTheme}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
              <button
                onClick={onLogout}
                className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === item.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;