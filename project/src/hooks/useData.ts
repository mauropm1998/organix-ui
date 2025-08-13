import { useState, useEffect } from 'react';
import { Draft, Content, Product, User, Company } from '../types';
import { mockDrafts, mockContent, mockProducts, mockUsers } from '../data/mockData';

export const useData = (companyId?: string) => {
  const [drafts, setDrafts] = useState<Draft[]>(mockDrafts);
  const [content, setContent] = useState<Content[]>(mockContent);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [users, setUsers] = useState<User[]>(mockUsers);

  // Filter data by company
  const companyDrafts = companyId ? drafts.filter(d => d.companyId === companyId) : drafts;
  const companyContent = companyId ? content.filter(c => c.companyId === companyId) : content;
  const companyProducts = companyId ? products.filter(p => p.companyId === companyId) : products;
  const companyUsers = companyId ? users.filter(u => u.companyId === companyId) : users;

  // Draft operations
  const addDraft = (draft: Omit<Draft, 'id' | 'createdAt' | 'companyId'>) => {
    const newDraft: Draft = {
      ...draft,
      id: Date.now().toString(),
      createdAt: new Date(),
      companyId: companyId || '1'
    };
    setDrafts(prev => [...prev, newDraft]);
    return newDraft;
  };

  const updateDraft = (id: string, updates: Partial<Draft>) => {
    setDrafts(prev => prev.map(draft => 
      draft.id === id ? { ...draft, ...updates } : draft
    ));
  };

  const deleteDraft = (id: string) => {
    setDrafts(prev => prev.filter(draft => draft.id !== id));
  };

  // Content operations
  const addContent = (contentItem: Omit<Content, 'id' | 'creationDate' | 'companyId'>) => {
    const newContent: Content = {
      ...contentItem,
      id: Date.now().toString(),
      creationDate: new Date(),
      companyId: companyId || '1'
    };
    setContent(prev => [...prev, newContent]);
    return newContent;
  };

  const updateContent = (id: string, updates: Partial<Content>) => {
    setContent(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const deleteContent = (id: string) => {
    setContent(prev => prev.filter(item => item.id !== id));
  };

  // Product operations
  const addProduct = (product: Omit<Product, 'id' | 'companyId'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      companyId: companyId || '1'
    };
    setProducts(prev => [...prev, newProduct]);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(product => 
      product.id === id ? { ...product, ...updates } : product
    ));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  // User operations
  const addUser = (user: Omit<User, 'id' | 'companyId'>) => {
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      companyId: companyId || '1'
    };
    setUsers(prev => [...prev, newUser]);
    return newUser;
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(user => 
      user.id === id ? { ...user, ...updates } : user
    ));
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  // Transform draft to content
  const transformDraftToContent = (draftId: string, contentData: Omit<Content, 'id' | 'creationDate' | 'name' | 'type' | 'companyId'>) => {
    const draft = companyDrafts.find(d => d.id === draftId);
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