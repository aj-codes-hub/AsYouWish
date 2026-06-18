import React, { createContext, useState, useContext, useEffect } from 'react';

interface UserType {
    id: number;
    name: string;
    email: string;
    password?: string;
    phone?: string;
    address?: string;
    city?: string;
    zipCode?: string;
}

interface AuthContextType {
    user: UserType | null;
    isLoggedIn: boolean;
    login: (email: string, password: string) => boolean;
    signup: (name: string, email: string, password: string) => boolean;
    logout: () => void;
    users: UserType[];
    updateUser: (data: Partial<UserType>) => void; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    
    // ✅ Users list localStorage se load karo
    const [users, setUsers] = useState<UserType[]>(() => {
        const savedUsers = localStorage.getItem('users');
        return savedUsers ? JSON.parse(savedUsers) : [];
    });

    // ✅ Current user localStorage se load karo
    const [user, setUser] = useState<UserType | null>(() => {
        const savedUser = localStorage.getItem('currentUser');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    // ✅ Jab users change ho localStorage update karo
    useEffect(() => {
        localStorage.setItem('users', JSON.stringify(users));
    }, [users]);


    useEffect(() => {
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
        } else {
            localStorage.removeItem('currentUser');
        }
    }, [user]);

  const signup = (name: string, email: string, password: string, phone: string = ''): boolean => {
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        alert('Email already registered!');
        return false;
    }

    const newUser: UserType = {
        id: Date.now(),
        name,
        email,
        password,
        phone,           
        address: '',     
        city: '',       
        zipCode: '',     
    };

    setUsers([...users, newUser]);
    alert('Signup successful! Please login.');
    return true;
};

    // ✅ Login Function
    const login = (email: string, password: string): boolean => {
        const foundUser = users.find(u => u.email === email && u.password === password);
        
        if (foundUser) {
            setUser(foundUser);
            alert('Login successful!');
            return true;
        } else {
            alert('Invalid email or password!');
            return false;
        }
    };

    // ✅ Logout Function
    const logout = () => {
        setUser(null);
        localStorage.removeItem('currentUser');
        alert('Logged out successfully!');
    };

    const updateUser = (data: Partial<UserType>) => {
    if (user) {
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        

        const updatedUsers = users.map(u => 
            u.id === user.id ? { ...u, ...data } : u
        );
        setUsers(updatedUsers);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        
        alert('Profile updated successfully!');
    }
};


    const isLoggedIn = user !== null;

    return (
        <AuthContext.Provider value={{
            user,
            isLoggedIn,
            login,
            signup,
            logout,
            users,
            updateUser
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