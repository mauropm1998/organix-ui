<template>
  <div>
    <!-- Login/SignUp Forms -->
    <SignUpForm 
      v-if="!user && !company && showSignUp"
      @signUp="signUp" 
      @backToLogin="showSignUp = false" 
    />
    <LoginForm 
      v-else-if="!user || !company"
      @login="login" 
      @showSignUp="showSignUp = true" 
    />
    
    <!-- Main Application -->
    <Layout
      v-else
      :user="user"
      :company="company"
      :theme="theme"
      :activeTab="activeTab"
      @logout="logout"
      @toggleTheme="toggleTheme"
      @tabChange="setActiveTab"
    >
      <component :is="currentComponent" v-bind="componentProps" />
    </Layout>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuth } from './composables/useAuth.js';
import { useTheme } from './composables/useTheme.js';
import { useData } from './composables/useData.js';
import LoginForm from './components/LoginForm.vue';
import SignUpForm from './components/SignUpForm.vue';
import Layout from './components/Layout.vue';
import Dashboard from './components/Dashboard.vue';
import DraftManager from './components/DraftManager.vue';
import ContentManager from './components/ContentManager.vue';
import ProductManager from './components/ProductManager.vue';
import UserManager from './components/UserManager.vue';
import Calendar from './components/Calendar.vue';
import Performance from './components/Performance.vue';

const { user, company, login, signUp, logout } = useAuth();
const { theme, toggleTheme } = useTheme();
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
} = useData(computed(() => company.value?.id));

const activeTab = ref('dashboard');
const showSignUp = ref(false);

const setActiveTab = (tab: string) => {
  activeTab.value = tab;
};

const currentComponent = computed(() => {
  switch (activeTab.value) {
    case 'dashboard':
      return Dashboard;
    case 'drafts':
      return DraftManager;
    case 'content':
      return ContentManager;
    case 'products':
      return ProductManager;
    case 'users':
      return UserManager;
    case 'calendar':
      return Calendar;
    case 'performance':
      return Performance;
    default:
      return Dashboard;
  }
});

const componentProps = computed(() => {
  const baseProps = {
    user: user.value,
    drafts: drafts.value,
    content: content.value,
    products: products.value,
    users: users.value
  };

  switch (activeTab.value) {
    case 'drafts':
      return {
        ...baseProps,
        onAddDraft: addDraft,
        onUpdateDraft: updateDraft,
        onDeleteDraft: deleteDraft
      };
    case 'content':
      return {
        ...baseProps,
        onAddContent: addContent,
        onUpdateContent: updateContent,
        onDeleteContent: deleteContent,
        onTransformDraft: transformDraftToContent
      };
    case 'products':
      return {
        ...baseProps,
        onAddProduct: addProduct,
        onUpdateProduct: updateProduct,
        onDeleteProduct: deleteProduct
      };
    case 'users':
      return {
        ...baseProps,
        onAddUser: addUser,
        onUpdateUser: updateUser,
        onDeleteUser: deleteUser
      };
    default:
      return baseProps;
  }
});
</script>