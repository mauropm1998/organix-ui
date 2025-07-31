import { ref, onMounted } from 'vue';
import { mockUsers, mockCompanies } from '../data/mockData.js';

/**
 * Composable for authentication management
 * @returns {Object} Authentication state and methods
 */
export const useAuth = () => {
  const user = ref(null);
  const company = ref(null);

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

  /**
   * Login user with email and password
   * @param {string} email 
   * @param {string} password 
   * @returns {boolean} Success status
   */
  const login = (email, password) => {
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

  /**
   * Sign up new company and admin user
   * @param {Object} companyData 
   * @param {Object} adminData 
   * @returns {boolean} Success status
   */
  const signUp = (companyData, adminData) => {
    const newCompany = {
      ...companyData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    
    const newAdmin = {
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