// src/types/adminTypes.ts
export interface AdminUser {
  id: number;
  email: string;
  password: string;
  name: string;
  role: 'admin';
}

export interface AdminProduct {
  id: number;
  title: string;
  price: number;
  discount: number;
  details: string;
  mainImage: string;
  moreImages: string[];
  Event: string;
  Rating: number;
  review: any[];
  stock: number;
  category: string;
  isFeatured: boolean;
  createdAt: string;
  fabricType?: string;
  productType?: string;
  designType?: string;
  pieces?: string;
  color?: string;
  size?: string;
}

export interface AdminOrder {
  id: string;
  date: string;
  total: number;
  items: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  products: any[];
  shippingAddress: string;
  paymentMethod: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}