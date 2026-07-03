// src/context/wishlistContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';

interface WishlistItemType {
  id: number | string;
  title: string;
  price: number;
  mainImage: string;
  _id?: string;
}

interface WishlistContextType {
  wishlist: WishlistItemType[];
  addToWishlist: (product: any) => void;
  removeFromWishlist: (id: number | string) => void;
  isInWishlist: (id: number | string) => boolean;
  totalWishlistItems: number;
  isAnimatingwishlist: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [wishlist, setWishlist] = useState<WishlistItemType[]>(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  const [isAnimatingwishlist, setIsAnimatingWishlist] = useState(false);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // ✅ FIXED: Duplicate check with both id and _id
  const addToWishlist = (product: any) => {
    const productId = product._id || product.id;
    
    // ✅ Check if product already exists
    const exists = wishlist.some(item => {
      const itemId = item._id || item.id;
      return itemId === productId;
    });
    
    if (exists) {
      // ✅ If already exists, remove it (toggle)
      removeFromWishlist(productId);
      return;
    }
    
    setIsAnimatingWishlist(true);
    
    const newItem = {
      id: product.id || product._id,
      _id: product._id || product.id,
      title: product.title,
      price: product.price,
      mainImage: product.mainImage
    };
    
    setWishlist([...wishlist, newItem]);

    setTimeout(() => {
      setIsAnimatingWishlist(false);
    }, 1000);
  };

  // ✅ FIXED: Remove by id or _id
  const removeFromWishlist = (id: number | string) => {
    setWishlist(wishlist.filter(item => {
      const itemId = item._id || item.id;
      return itemId !== id;
    }));
  };

  // ✅ FIXED: Check by id or _id
  const isInWishlist = (id: number | string) => {
    return wishlist.some(item => {
      const itemId = item._id || item.id;
      return itemId === id;
    });
  };

  const totalWishlistItems = wishlist.length;

  return (
    <WishlistContext.Provider value={{
      wishlist,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      totalWishlistItems,
      isAnimatingwishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
};