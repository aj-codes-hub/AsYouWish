// src/services/subscriberService.ts
import api from './api';

export const subscribe = async (email: string) => {
  try {
    const response = await api.post('/subscribers/subscribe', { email });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const unsubscribe = async (email: string) => {
  try {
    const response = await api.delete('/subscribers/unsubscribe', { data: { email } });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const getSubscribers = async () => {
  try {
    const response = await api.get('/subscribers/subscribers');
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};