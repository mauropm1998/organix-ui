import { useState, useEffect } from 'react';
import { User, Company } from '../types';
import { mockUsers, mockCompanies } from '../data/mockData';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState<Company | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('organix-user');
    const savedCompany = localStorage.getItem('organix-company');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      if (savedCompany) {
        setCompany(JSON.parse(savedCompany));
      } else {
        const userCompany = mockCompanies.find(c => c.id === userData.companyId);
        if (userCompany) {
          setCompany(userCompany);
          localStorage.setItem('organix-company', JSON.stringify(userCompany));
        }
      }
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    if (foundUser) {
      const userCompany = mockCompanies.find(c => c.id === foundUser.companyId);
      setUser(foundUser);
      setCompany(userCompany || null);
      localStorage.setItem('organix-user', JSON.stringify(foundUser));
      if (userCompany) {
        localStorage.setItem('organix-company', JSON.stringify(userCompany));
      }
      return true;
    }
    return false;
  };

  const signUp = (companyData: Omit<Company, 'id' | 'createdAt'>, adminData: Omit<User, 'id' | 'companyId'>): boolean => {
    // In a real app, this would make an API call
    const newCompany: Company = {
      ...companyData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    
    const newAdmin: User = {
      ...adminData,
      id: (Date.now() + 1).toString(),
      companyId: newCompany.id,
      adminType: 'admin'
    };
    
    // Update the admin ID in company
    newCompany.adminId = newAdmin.id;
    
    // In a real app, these would be saved to the backend
    mockCompanies.push(newCompany);
    mockUsers.push(newAdmin);
    
    setUser(newAdmin);
    setCompany(newCompany);
    localStorage.setItem('organix-user', JSON.stringify(newAdmin));
    localStorage.setItem('organix-company', JSON.stringify(newCompany));
    
    return true;
  };
  const logout = () => {
    setUser(null);
    setCompany(null);
    localStorage.removeItem('organix-user');
    localStorage.removeItem('organix-company');
  };

  return { user, company, login, signUp, logout };
};