// src/services/orderService.ts
import api from './api';

export const createOrder = async (orderData: any) => {
  try {
    const response = await api.post('/orders', orderData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const getMyOrders = async () => {
  try {
    const response = await api.get('/orders/my-orders');
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const getAllOrders = async () => {
  try {
    const response = await api.get('/orders');
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const getOrderById = async (id: string) => {
  try {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const updateOrderStatus = async (id: string, status: string) => {
  try {
    const response = await api.put(`/orders/${id}/status`, { status });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const cancelOrder = async (id: string) => {
  try {
    const response = await api.put(`/orders/${id}/cancel`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};