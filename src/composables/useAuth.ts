import { ref, onMounted } from 'vue';
import type { User, Company } from '../types';
import { mockUsers, mockCompanies } from '../data/mockData';

export const useAuth = () => {
  const user = ref<User | null>(null);
  const company = ref<Company | null>(null);

  onMounted(() => {
    const savedUser = localStorage.getItem('organix-user');
    const savedCompany = localStorage.getItem('organix-company');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      user.value = userData;
      if (savedCompany) {
        company.value = JSON.parse(savedCompany);
      } else {
        const userCompany = mockCompanies.find(c => c.id === userData.companyId);
        if (userCompany) {
          company.value = userCompany;
          localStorage.setItem('organix-company', JSON.stringify(userCompany));
        }
      }
    }
  });

  const login = (email: string, password: string): boolean => {
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    if (foundUser) {
      const userCompany = mockCompanies.find(c => c.id === foundUser.companyId);
      user.value = foundUser;
      company.value = userCompany || null;
      localStorage.setItem('organix-user', JSON.stringify(foundUser));
      if (userCompany) {
        localStorage.setItem('organix-company', JSON.stringify(userCompany));
      }
      return true;
    }
    return false;
  };

  const signUp = (companyData: Omit<Company, 'id' | 'createdAt'>, adminData: Omit<User, 'id' | 'companyId'>): boolean => {
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
    
    newCompany.adminId = newAdmin.id;
    
    mockCompanies.push(newCompany);
    mockUsers.push(newAdmin);
    
    user.value = newAdmin;
    company.value = newCompany;
    localStorage.setItem('organix-user', JSON.stringify(newAdmin));
    localStorage.setItem('organix-company', JSON.stringify(newCompany));
    
    return true;
  };

  const logout = () => {
    user.value = null;
    company.value = null;
    localStorage.removeItem('organix-user');
    localStorage.removeItem('organix-company');
  };

  return { user, company, login, signUp, logout };
};