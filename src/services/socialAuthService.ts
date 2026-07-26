// services/socialAuthService.ts
import axios from 'axios';
import { auth, signInWithGoogle } from '../firebase/firebaseConfig';

// ✅ Use environment variable for API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const handleSocialLogin = async (userData: any) => {
    try {
        console.log('📡 Sending to backend:', `${API_URL}/auth/social-login`);
        const response = await axios.post(`${API_URL}/auth/social-login`, userData);
        console.log('✅ Backend response:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('❌ Backend social login error:', error.response?.data || error.message);
        throw error;
    }
};

export const loginWithGoogle = async () => {
    try {
        console.log('🔄 Google signin starting...');
        
        // ✅ 1. Firebase Google Signin
        const userData = await signInWithGoogle();
        console.log('✅ Firebase user:', userData);
        
        // ✅ 2. Firebase token lein (with proper type handling)
        const token = await auth.currentUser?.getIdToken() || '';
        console.log('✅ Firebase token obtained');
        
        // ✅ 3. Backend call
        const response = await handleSocialLogin({
            name: userData.name,
            email: userData.email,
            photoURL: userData.photoURL,
            provider: userData.provider,
            providerId: userData.id,
        });
        
        console.log('✅ Backend response:', response);
        
        // ✅ 4. Return consistent response
        return {
            token: response.token || token,
            name: response.name || userData.name,
            email: response.email || userData.email,
            photoURL: response.photoURL || userData.photoURL || '',
            role: response.role || 'user',
            _id: response._id || '',
        };
        
    } catch (error: any) {
        console.error('❌ Google login error:', error);
        
        // ✅ Agar Firebase error hai toh signout karein
        if (error.code === 'auth/popup-closed-by-user') {
            throw new Error('Sign in cancelled by user');
        }
        
        throw new Error(error.message || 'Google signup failed. Please try again.');
    }
};