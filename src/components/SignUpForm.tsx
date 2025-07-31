import React, { useState } from 'react';
import { Building2, User, Mail, Lock, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { t } from '../translations';

interface SignUpFormProps {
  onSignUp: (companyData: { name: string; adminId: string }, adminData: { name: string; email: string; password: string }) => boolean;
  onBackToLogin: () => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onSignUp, onBackToLogin }) => {
  const { language } = useLanguage();
  const [step, setStep] = useState(1);
  const [companyData, setCompanyData] = useState({
    name: ''
  });
  const [adminData, setAdminData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleCompanySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyData.name.trim()) {
      setError(t('companyNameRequired', language));
      return;
    }
    setError('');
    setStep(2);
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!adminData.name.trim() || !adminData.email.trim() || !adminData.password.trim()) {
      setError(t('allFieldsRequired', language));
      return;
    }

    if (adminData.password !== adminData.confirmPassword) {
      setError(t('passwordsDoNotMatch', language));
      return;
    }

    if (adminData.password.length < 6) {
      setError(t('passwordMinLength', language));
      return;
    }

    const success = onSignUp(
      { name: companyData.name, adminId: '' },
      { 
        name: adminData.name, 
        email: adminData.email, 
        password: adminData.password 
      }
    );

    if (!success) {
      setError(t('failedToCreateAccount', language));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 transition-colors">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('createOrganixAccount', language)}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {step === 1 ? t('setupCompany', language) : t('createAdminAccount', language)}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            1
          </div>
          <div className={`w-16 h-1 mx-2 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            2
          </div>
        </div>

        {step === 1 ? (
          <form onSubmit={handleCompanySubmit} className="space-y-6">
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <Building2 className="w-4 h-4 inline mr-2" />
                {t('companyName', language)}
              </label>
              <input
                type="text"
                id="companyName"
                value={companyData.name}
                onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                placeholder={t('enterCompanyName', language)}
                required
              />
            </div>

            {error && (
              <div className="text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              {t('continue', language)}
            </button>
          </form>
        ) : (
          <form onSubmit={handleAdminSubmit} className="space-y-6">
            <div>
              <label htmlFor="adminName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <User className="w-4 h-4 inline mr-2" />
                {t('adminName', language)}
              </label>
              <input
                type="text"
                id="adminName"
                value={adminData.name}
                onChange={(e) => setAdminData({ ...adminData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                placeholder={t('enterAdminName', language)}
                required
              />
            </div>

            <div>
              <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <Mail className="w-4 h-4 inline mr-2" />
                {t('email', language)}
              </label>
              <input
                type="email"
                id="adminEmail"
                value={adminData.email}
                onChange={(e) => setAdminData({ ...adminData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                placeholder={t('enterAdminEmail', language)}
                required
              />
            </div>

            <div>
              <label htmlFor="adminPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <Lock className="w-4 h-4 inline mr-2" />
                {t('password', language)}
              </label>
              <input
                type="password"
                id="adminPassword"
                value={adminData.password}
                onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                placeholder={t('enterPassword', language)}
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <Lock className="w-4 h-4 inline mr-2" />
                {t('confirmPassword', language)}
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={adminData.confirmPassword}
                onChange={(e) => setAdminData({ ...adminData, confirmPassword: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                placeholder={t('confirmYourPassword', language)}
                required
              />
            </div>

            {error && (
              <div className="text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
              >
                {t('back', language)}
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                {t('createAccount', language)}
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={onBackToLogin}
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            {t('backToLogin', language)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;