// src/services/productService.ts
import api from './api';

interface Product {
  _id?: string;
  title: string;
  price: number;
  discount: number;
  details: string;
  mainImage: string;
  moreImages: string[];
  category: string;
  stock: number;
  isFeatured: boolean;
  fabricType?: string;
  productType?: string;
  designType?: string;
  pieces?: string;
  color?: string;
  size?: string;
}

// Get all products
export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await api.get<Product[]>('/products');
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

// Get single product by ID
export const getProductById = async (id: string): Promise<Product> => {
  try {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

// Create product (Admin only)
export const createProduct = async (productData: Omit<Product, '_id'>): Promise<Product> => {
  try {
    const response = await api.post<Product>('/products', productData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

// Update product (Admin only)
export const updateProduct = async (id: string, productData: Partial<Product>): Promise<Product> => {
  try {
    const response = await api.put<Product>(`/products/${id}`, productData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

// Delete product (Admin only)
export const deleteProduct = async (id: string): Promise<{ message: string }> => {
  try {
    const response = await api.delete<{ message: string }>(`/products/${id}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};