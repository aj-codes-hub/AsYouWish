// src/context/AdminContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { login } from '../../services';

interface AdminUser {
  id: number;
  email: string;
  name: string;
  role: 'admin';
}

interface AdminContextType {
  admin: AdminUser | null;
  isAdminLoggedIn: boolean;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  adminLogout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(() => {
    const savedAdmin = localStorage.getItem('adminUser');
    return savedAdmin ? JSON.parse(savedAdmin) : null;
  });

  useEffect(() => {
    if (admin) {
      localStorage.setItem('adminUser', JSON.stringify(admin));
    } else {
      localStorage.removeItem('adminUser');
    }
  }, [admin]);

  // ✅ Admin Login - Backend se verify karo
  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      const data = await login({ email, password });
      
      // ✅ Check if user is admin
      if (data.role !== 'admin') {
        console.log('❌ User is not admin:', data.role);
        return false;
      }
      
      const adminUser: AdminUser = {
        id: Number(data._id),
        email: data.email,
        name: data.name,
        role: 'admin',
      };
      
      setAdmin(adminUser);
      localStorage.setItem('adminUser', JSON.stringify(adminUser));
      localStorage.setItem('token', data.token);
      
      return true;
      
    } catch (error: any) {
      console.error('❌ Admin login error:', error);
      return false;
    }
  };

  const adminLogout = () => {
    setAdmin(null);
    localStorage.removeItem('adminUser');
    localStorage.removeItem('token');
  };

  return (
    <AdminContext.Provider value={{
      admin,
      isAdminLoggedIn: admin !== null,
      adminLogin,
      adminLogout,
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};