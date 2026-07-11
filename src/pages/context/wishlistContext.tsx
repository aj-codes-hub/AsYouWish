import React, { createContext, useState, useContext, useEffect } from 'react';

interface WishlistItemType {
  id: number | string;
  _id?: string;
  title: string;
  price: number;
  mainImage: string;
  discount?: number;
  DiscountPrice?: number;
  moreImages?: string[];
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

  const addToWishlist = (product: any) => {
    const productId = product._id || product.id;
    
    const exists = wishlist.some(item => {
      const itemId = item._id || item.id;
      return itemId === productId;
    });
    
    if (exists) {
      removeFromWishlist(productId);
      return;
    }
    
    setIsAnimatingWishlist(true);
    
    // ✅ Calculate discount price
    const discountPrice = product.DiscountPrice || 
      (product.discount ? Math.round(product.price - (product.price * product.discount / 100)) : product.price);
    
    // ✅ Save ALL properties
    const newItem: WishlistItemType = {
      id: product.id || product._id,
      _id: product._id || product.id,
      title: product.title,
      price: product.price,
      mainImage: product.mainImage,
      discount: product.discount || 0,
      DiscountPrice: discountPrice,
      moreImages: product.moreImages || [],
    };
    
    setWishlist([...wishlist, newItem]);

    setTimeout(() => {
      setIsAnimatingWishlist(false);
    }, 1000);
  };

  const removeFromWishlist = (id: number | string) => {
    setWishlist(wishlist.filter(item => {
      const itemId = item._id || item.id;
      return itemId !== id;
    }));
  };

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
      isAnimatingwishlist,
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