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
  uid?: string;
}

interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  token: string;
}

// ✅ Fix 1: Register user with better error handling
export const register = async (userData: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/register', userData);
    
    // ✅ Save token and user data on successful registration
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Registration error:', error);
    // ✅ Better error message handling
    if (error.response) {
      // Server responded with error
      throw error.response.data?.message || error.response.data || 'Registration failed';
    } else if (error.request) {
      // No response from server
      throw 'Network error. Please check your connection.';
    } else {
      throw error.message || 'Registration failed';
    }
  }
};

// ✅ Fix 2: Login user with proper token storage
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    
    // ✅ Save token and user data on successful login
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Login error:', error);
    // ✅ Better error message handling
    if (error.response) {
      throw error.response.data?.message || error.response.data || 'Invalid email or password';
    } else if (error.request) {
      throw 'Network error. Please check your connection.';
    } else {
      throw error.message || 'Login failed';
    }
  }
};

// ✅ Fix 3: Get user profile with token validation
export const getProfile = async (): Promise<AuthResponse> => {
  try {
    const token = localStorage.getItem('token');
    
    // ✅ Check if token exists before making request
    if (!token) {
      throw new Error('No token found. Please login again.');
    }
    
    const response = await api.get<AuthResponse>('/auth/profile');
    
    // ✅ Update user data in localStorage
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Get profile error:', error);
    
    // ✅ If unauthorized, clear local storage
    if (error.response?.status === 401) {
      logout();
      throw new Error('Session expired. Please login again.');
    }
    
    if (error.response) {
      throw error.response.data?.message || error.response.data || 'Failed to get profile';
    } else if (error.request) {
      throw 'Network error. Please check your connection.';
    } else {
      throw error.message || 'Failed to get profile';
    }
  }
};

// ✅ Fix 4: Logout with cleanup
export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // ✅ Optional: Clear other user-related data
  localStorage.removeItem('userAddresses');
  // ✅ Optional: Dispatch logout event for other components
  window.dispatchEvent(new Event('logout'));
};

// ✅ Fix 5: Helper function to check if user is logged in
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return !!(token && user);
};

// ✅ Fix 6: Helper function to get current user
export const getCurrentUser = (): AuthResponse | null => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

// ✅ Fix 7: Helper function to get token
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// ✅ Fix 8: Update user profile (for future use)
export const updateProfile = async (data: Partial<RegisterData>): Promise<AuthResponse> => {
  try {
    const response = await api.put<AuthResponse>('/auth/profile', data);
    
    // ✅ Update user data in localStorage
    if (response.data) {
      const currentUser = getCurrentUser();
      if (currentUser) {
        localStorage.setItem('user', JSON.stringify({ ...currentUser, ...response.data }));
      }
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Update profile error:', error);
    if (error.response) {
      throw error.response.data?.message || error.response.data || 'Failed to update profile';
    } else if (error.request) {
      throw 'Network error. Please check your connection.';
    } else {
      throw error.message || 'Failed to update profile';
    }
  }
};