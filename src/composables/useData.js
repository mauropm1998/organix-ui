import { ref, computed } from 'vue';
import { mockDrafts, mockContent, mockProducts, mockUsers } from '../data/mockData.js';

/**
 * Composable for data management
 * @param {import('vue').ComputedRef<string>} companyId 
 * @returns {Object} Data state and methods
 */
export const useData = (companyId) => {
  const drafts = ref([...mockDrafts]);
  const content = ref([...mockContent]);
  const products = ref([...mockProducts]);
  const users = ref([...mockUsers]);

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
  const addDraft = (draft) => {
    const newDraft = {
      ...draft,
      id: Date.now().toString(),
      createdAt: new Date(),
      companyId: companyId.value || '1'
    };
    drafts.value.push(newDraft);
    return newDraft;
  };

  const updateDraft = (id, updates) => {
    const index = drafts.value.findIndex(draft => draft.id === id);
    if (index !== -1) {
      drafts.value[index] = { ...drafts.value[index], ...updates };
    }
  };

  const deleteDraft = (id) => {
    const index = drafts.value.findIndex(draft => draft.id === id);
    if (index !== -1) {
      drafts.value.splice(index, 1);
    }
  };

  // Content operations
  const addContent = (contentItem) => {
    const newContent = {
      ...contentItem,
      id: Date.now().toString(),
      creationDate: new Date(),
      companyId: companyId.value || '1'
    };
    content.value.push(newContent);
    return newContent;
  };

  const updateContent = (id, updates) => {
    const index = content.value.findIndex(item => item.id === id);
    if (index !== -1) {
      content.value[index] = { ...content.value[index], ...updates };
    }
  };

  const deleteContent = (id) => {
    const index = content.value.findIndex(item => item.id === id);
    if (index !== -1) {
      content.value.splice(index, 1);
    }
  };

  // Product operations
  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Date.now().toString(),
      companyId: companyId.value || '1'
    };
    products.value.push(newProduct);
    return newProduct;
  };

  const updateProduct = (id, updates) => {
    const index = products.value.findIndex(product => product.id === id);
    if (index !== -1) {
      products.value[index] = { ...products.value[index], ...updates };
    }
  };

  const deleteProduct = (id) => {
    const index = products.value.findIndex(product => product.id === id);
    if (index !== -1) {
      products.value.splice(index, 1);
    }
  };

  // User operations
  const addUser = (user) => {
    const newUser = {
      ...user,
      id: Date.now().toString(),
      companyId: companyId.value || '1'
    };
    users.value.push(newUser);
    return newUser;
  };

  const updateUser = (id, updates) => {
    const index = users.value.findIndex(user => user.id === id);
    if (index !== -1) {
      users.value[index] = { ...users.value[index], ...updates };
    }
  };

  const deleteUser = (id) => {
    const index = users.value.findIndex(user => user.id === id);
    if (index !== -1) {
      users.value.splice(index, 1);
    }
  };

  // Transform draft to content
  const transformDraftToContent = (draftId, contentData) => {
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