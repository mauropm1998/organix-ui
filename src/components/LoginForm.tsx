import React, { useState } from 'react';
import { AlertCircle, UserPlus } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { t } from '../translations';

interface LoginFormProps {
  onLogin: (email: string, password: string) => boolean;
  onShowSignUp: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onShowSignUp }) => {
  const { language } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = onLogin(email, password);
    if (!success) {
      setError(t('invalidCredentials', language));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 transition-colors">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Organix
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('contentProductionManagement', language)}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('email', language)}
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('password', language)}
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
              required
            />
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {t('signIn', language)}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={onShowSignUp}
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            <UserPlus className="w-4 h-4 mr-1" />
            {t('createNewCompanyAccount', language)}
          </button>
        </div>

        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('demoAccounts', language)}</h3>
          <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <div>{t('admin', language)}: admin@organix.com / admin123</div>
            <div>{t('operator', language)}: john@organix.com / operator123</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;