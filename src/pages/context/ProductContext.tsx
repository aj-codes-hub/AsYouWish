// src/context/ProductContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AdminProduct } from '../../data/productCard/Types/adminTypes';
import { Product } from '../../data/productCard/product';


interface ProductContextType {
  products: AdminProduct[];
  addProduct: (product: Omit<AdminProduct, 'id' | 'createdAt'>) => void;
  updateProduct: (id: number, product: Partial<AdminProduct>) => void;
  deleteProduct: (id: number) => void;
  getProduct: (id: number) => AdminProduct | undefined;
  searchProducts: (query: string) => AdminProduct[];
  toggleFeatured: (id: number) => void;
  updateStock: (id: number, stock: number) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Initial products from your existing data
const initialProducts: AdminProduct[] = Product.map((p: any) => ({
  ...p,
  stock: Math.floor(Math.random() * 50) + 10,
  category: p.Event || 'Uncategorized',
  isFeatured: p.Event === 'FeaturedCollection',
  createdAt: new Date().toISOString(),
}));

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<AdminProduct[]>(() => {
    const saved = localStorage.getItem('adminProducts');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  useEffect(() => {
    localStorage.setItem('adminProducts', JSON.stringify(products));
  }, [products]);

  const addProduct = (productData: Omit<AdminProduct, 'id' | 'createdAt'>) => {
    const newProduct: AdminProduct = {
      ...productData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (id: number, productData: Partial<AdminProduct>) => {
    setProducts(products.map(p => 
      p.id === id ? { ...p, ...productData } : p
    ));
  };

  const deleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const getProduct = (id: number) => {
    return products.find(p => p.id === id);
  };

  const searchProducts = (query: string) => {
    const lowerQuery = query.toLowerCase().trim();
    if (!lowerQuery) return products;
    return products.filter(p => 
      p.title.toLowerCase().includes(lowerQuery) ||
      p.details.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery)
    );
  };

  const toggleFeatured = (id: number) => {
    setProducts(products.map(p =>
      p.id === id ? { ...p, isFeatured: !p.isFeatured } : p
    ));
  };

  const updateStock = (id: number, stock: number) => {
    setProducts(products.map(p =>
      p.id === id ? { ...p, stock: Math.max(0, stock) } : p
    ));
  };

  return (
    <ProductContext.Provider value={{
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      getProduct,
      searchProducts,
      toggleFeatured,
      updateStock,
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within ProductProvider');
  }
  return context;
};