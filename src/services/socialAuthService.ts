// src/services/socialAuthService.ts
import api from './api';
import { signInWithGoogle } from '../firebase/firebaseConfig';

export const loginWithGoogle = async () => {
  try {
    console.log('🔄 Google signin starting...');
    
    // ✅ 1. Firebase Google Signin
    const userData = await signInWithGoogle();
    console.log('✅ Firebase user:', userData);
    
    // ✅ 2. Backend call using api (interceptor automatically adds token)
    const response = await api.post('/auth/social-login', {
      name: userData.name,
      email: userData.email,
      photoURL: userData.photoURL,
      provider: 'google',
      providerId: userData.id,
    });
    
    console.log('✅ Backend response:', response.data);
    
    // ✅ 3. Return response
    return {
      token: response.data.token,
      _id: response.data._id,
      name: response.data.name,
      email: response.data.email,
      role: response.data.role || 'user',
      photoURL: response.data.photoURL || '',
    };
    
  } catch (error: any) {
    console.error('❌ Google login error:', error);
    throw new Error(error.message || 'Google signup failed. Please try again.');
  }
};