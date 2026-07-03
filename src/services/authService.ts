// src/services/authService.ts
import api from './api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  token: string;
}

// Register user
export const register = async (userData: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/register', userData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

// Login user
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

// Get user profile
export const getProfile = async (): Promise<AuthResponse> => {
  try {
    const response = await api.get<AuthResponse>('/auth/profile');
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

// Logout user
export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};