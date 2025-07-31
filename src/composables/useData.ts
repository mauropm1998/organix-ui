import { ref, computed, type Ref, type ComputedRef } from 'vue';
import type { Draft, Content, Product, User } from '../types';
import { mockDrafts, mockContent, mockProducts, mockUsers } from '../data/mockData';

export const useData = (companyId: ComputedRef<string | undefined>) => {
  const drafts = ref<Draft[]>(mockDrafts);
  const content = ref<Content[]>(mockContent);
  const products = ref<Product[]>(mockProducts);
  const users = ref<User[]>(mockUsers);

  // Filter data by company
  const companyDrafts = computed(() => 
    companyId.value ? drafts.value.filter(d => d.companyId === companyId.value) : drafts.value
  );
  const companyContent = computed(() => 
    companyId.value ? content.value.filter(c => c.companyId === companyId.value) : content.value
  );
  const companyProducts = computed(() => 
    companyId.value ? products.value.filter(p => p.companyId === companyId.value) : products.value
  );
  const companyUsers = computed(() => 
    companyId.value ? users.value.filter(u => u.companyId === companyId.value) : users.value
  );

  // Draft operations
  const addDraft = (draft: Omit<Draft, 'id' | 'createdAt' | 'companyId'>) => {
    const newDraft: Draft = {
      ...draft,
      id: Date.now().toString(),
      createdAt: new Date(),
      companyId: companyId.value || '1'
    };
    drafts.value.push(newDraft);
    return newDraft;
  };

  const updateDraft = (id: string, updates: Partial<Draft>) => {
    const index = drafts.value.findIndex(draft => draft.id === id);
    if (index !== -1) {
      drafts.value[index] = { ...drafts.value[index], ...updates };
    }
  };

  const deleteDraft = (id: string) => {
    const index = drafts.value.findIndex(draft => draft.id === id);
    if (index !== -1) {
      drafts.value.splice(index, 1);
    }
  };

  // Content operations
  const addContent = (contentItem: Omit<Content, 'id' | 'creationDate' | 'companyId'>) => {
    const newContent: Content = {
      ...contentItem,
      id: Date.now().toString(),
      creationDate: new Date(),
      companyId: companyId.value || '1'
    };
    content.value.push(newContent);
    return newContent;
  };

  const updateContent = (id: string, updates: Partial<Content>) => {
    const index = content.value.findIndex(item => item.id === id);
    if (index !== -1) {
      content.value[index] = { ...content.value[index], ...updates };
    }
  };

  const deleteContent = (id: string) => {
    const index = content.value.findIndex(item => item.id === id);
    if (index !== -1) {
      content.value.splice(index, 1);
    }
  };

  // Product operations
  const addProduct = (product: Omit<Product, 'id' | 'companyId'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      companyId: companyId.value || '1'
    };
    products.value.push(newProduct);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    const index = products.value.findIndex(product => product.id === id);
    if (index !== -1) {
      products.value[index] = { ...products.value[index], ...updates };
    }
  };

  const deleteProduct = (id: string) => {
    const index = products.value.findIndex(product => product.id === id);
    if (index !== -1) {
      products.value.splice(index, 1);
    }
  };

  // User operations
  const addUser = (user: Omit<User, 'id' | 'companyId'>) => {
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      companyId: companyId.value || '1'
    };
    users.value.push(newUser);
    return newUser;
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    const index = users.value.findIndex(user => user.id === id);
    if (index !== -1) {
      users.value[index] = { ...users.value[index], ...updates };
    }
  };

  const deleteUser = (id: string) => {
    const index = users.value.findIndex(user => user.id === id);
    if (index !== -1) {
      users.value.splice(index, 1);
    }
  };

  // Transform draft to content
  const transformDraftToContent = (draftId: string, contentData: Omit<Content, 'id' | 'creationDate' | 'name' | 'type' | 'companyId'>) => {
    const draft = companyDrafts.value.find(d => d.id === draftId);
    if (draft && draft.status === 'approved') {
      const newContent = addContent({
        name: draft.name,
        type: draft.type,
        ...contentData
      });
      deleteDraft(draftId);
      return newContent;
    }
    return null;
  };

  return {
    drafts: companyDrafts,
    content: companyContent,
    products: companyProducts,
    users: companyUsers,
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
  };
};