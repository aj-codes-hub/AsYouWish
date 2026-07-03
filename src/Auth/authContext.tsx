// src/Auth/authContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin, register as apiRegister } from '../services/authService';

interface UserType {
    id: number;
    name: string;
    email: string;
    password?: string;
    phone?: string;
    address?: string;
    city?: string;
    zipCode?: string;
    role?: string;
}

interface AuthResponse {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    role?: string;
    token: string;
}

interface AuthContextType {
    user: UserType | null;
    isLoggedIn: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    signup: (name: string, email: string, password: string, phone?: string) => Promise<boolean>;
    logout: () => void;
    updateUser: (data: Partial<UserType>) => Promise<void>;
    users: UserType[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [users] = useState<UserType[]>([]);
    const [user, setUser] = useState<UserType | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Load user from localStorage on mount
    useEffect(() => {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            try {
                const parsedUser = JSON.parse(savedUser);
                setUser(parsedUser);
                setIsLoggedIn(true);
            } catch {
                localStorage.removeItem('currentUser');
            }
        }
    }, []);

    // ✅ LOGIN - Backend API use karega
    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            const data: AuthResponse = await apiLogin({ email, password });
            
            const userData: UserType = {
                id: Number(data._id), // ✅ _id ko number mein convert karo
                name: data.name,
                email: data.email,
                phone: data.phone || '',
                role: data.role || 'user',
            };
            
            setUser(userData);
            setIsLoggedIn(true);
            localStorage.setItem('currentUser', JSON.stringify(userData));
            localStorage.setItem('token', data.token);
            
            return true;
        } catch (error: any) {
            console.error('Login error:', error);
            return false;
        }
    };

    // ✅ SIGNUP - Backend API use karega
    const signup = async (name: string, email: string, password: string, phone: string = ''): Promise<boolean> => {
        try {
            const data: AuthResponse = await apiRegister({ name, email, password, phone });
            
            const userData: UserType = {
                id: Number(data._id), // ✅ _id ko number mein convert karo
                name: data.name,
                email: data.email,
                phone: data.phone || '',
                role: data.role || 'user',
            };
            
            setUser(userData);
            setIsLoggedIn(true);
            localStorage.setItem('currentUser', JSON.stringify(userData));
            localStorage.setItem('token', data.token);
            
            return true;
        } catch (error: any) {
            console.error('Signup error:', error);
            return false;
        }
    };

    // ✅ UPDATE USER - Backend API use karega
    const updateUser = async (data: Partial<UserType>): Promise<void> => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            
            const newUserData = { ...user, ...data } as UserType;
            setUser(newUserData);
            localStorage.setItem('currentUser', JSON.stringify(newUserData));
            
        } catch (error) {
            console.error('Update error:', error);
            throw error;
        }
    };

    // ✅ LOGOUT
    const logout = () => {
        setUser(null);
        setIsLoggedIn(false);
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{
            user,
            isLoggedIn,
            login,
            signup,
            logout,
            updateUser,
            users,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};