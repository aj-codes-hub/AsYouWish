// src/context/AdminContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminUser {
  id: number;
  email: string;
  name: string;
  role: 'admin';
}

interface AdminContextType {
  admin: AdminUser | null;
  isAdminLoggedIn: boolean;
  adminLogin: (email: string, password: string) => boolean;
  adminLogout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Default admin credentials
const DEFAULT_ADMIN: AdminUser = {
  id: 1,
  email: 'admin@asyouwish.com',
  name: 'Admin',
  role: 'admin',
};

const ADMIN_PASSWORD = '123admin123';

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

  const adminLogin = (email: string, password: string): boolean => {
    if (email === DEFAULT_ADMIN.email && password === ADMIN_PASSWORD) {
      setAdmin(DEFAULT_ADMIN);
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setAdmin(null);
    localStorage.removeItem('adminUser');
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