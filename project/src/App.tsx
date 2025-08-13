import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useTheme } from './hooks/useTheme';
import { useLanguage } from './hooks/useLanguage';
import { useData } from './hooks/useData';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import DraftManager from './components/DraftManager';
import ContentManager from './components/ContentManager';
import ProductManager from './components/ProductManager';
import UserManager from './components/UserManager';
import Calendar from './components/Calendar';
import Performance from './components/Performance';

function App() {
  const { user, company, login, signUp, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language } = useLanguage();
  const {
    drafts,
    content,
    products,
    users,
    addDraft,
    updateDraft,
    deleteDraft,
    addContent,
    updateContent,
    deleteContent,
    addProduct,
    updateProduct,
    deleteProduct,
    addUser,
    updateUser,
    deleteUser,
    transformDraftToContent
  } = useData(company?.id);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [showSignUp, setShowSignUp] = useState(false);

  // If not logged in, show login form
  if (!user || !company) {
    if (showSignUp) {
      return (
        <SignUpForm 
          onSignUp={signUp} 
          onBackToLogin={() => setShowSignUp(false)} 
        />
      );
    }
    return (
      <LoginForm 
        onLogin={login} 
        onShowSignUp={() => setShowSignUp(true)} 
      />
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard user={user} drafts={drafts} content={content} />;
      case 'drafts':
        return (
          <DraftManager
            user={user}
            drafts={drafts}
            users={users}
            onAddDraft={addDraft}
            onUpdateDraft={updateDraft}
            onDeleteDraft={deleteDraft}
          />
        );
      case 'content':
        return (
          <ContentManager
            user={user}
            content={content}
            products={products}
            users={users}
            drafts={drafts}
            onAddContent={addContent}
            onUpdateContent={updateContent}
            onDeleteContent={deleteContent}
            onTransformDraft={transformDraftToContent}
          />
        );
      case 'products':
        return (
          <ProductManager
            user={user}
            products={products}
            onAddProduct={addProduct}
            onUpdateProduct={updateProduct}
            onDeleteProduct={deleteProduct}
          />
        );
      case 'users':
        return (
          <UserManager
            user={user}
            users={users}
            onAddUser={addUser}
            onUpdateUser={updateUser}
            onDeleteUser={deleteUser}
          />
        );
      case 'calendar':
        return (
          <Calendar
            user={user}
            content={content}
            products={products}
            users={users}
          />
        );
      case 'performance':
        return (
          <Performance
            user={user}
            content={content}
            products={products}
            users={users}
          />
        );
      default:
        return <Dashboard user={user} drafts={drafts} content={content} />;
    }
  };

  return (
    <Layout
      user={user}
      company={company}
      onLogout={logout}
      theme={theme}
      onToggleTheme={toggleTheme}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {renderContent()}
    </Layout>
  );
}

export default App;