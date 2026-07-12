// src/services/reviewService.ts
import api from './api';

export const addReview = async (productId: string, reviewData: any) => {
  try {
    const response = await api.post(`/products/${productId}/reviews`, reviewData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};