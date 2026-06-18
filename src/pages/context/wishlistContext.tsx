// context/wishlistContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';

interface WishlistItemType {
    id: number;
    title: string;
    price: number;
    mainImage: string;
}

interface WishlistContextType {
    wishlist: WishlistItemType[];
    addToWishlist: (product: any) => void;
    removeFromWishlist: (id: number) => void;
    isInWishlist: (id: number) => boolean;
    totalWishlistItems: number;
    isAnimatingwishlist: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
    
    // ✅ LocalStorage se wishlist load karo
    const [wishlist, setWishlist] = useState<WishlistItemType[]>(() => {
        const savedWishlist = localStorage.getItem('wishlist');
        return savedWishlist ? JSON.parse(savedWishlist) : [];
    });

    const [isAnimatingwishlist, setIsAnimatingWishlist] = useState(false);

    // ✅ Jab wishlist change ho localStorage update karo
    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const addToWishlist = (product: any) => {
        setIsAnimatingWishlist(true);
        
        const exists = wishlist.find(item => item.id === product.id);
        
        if (!exists) {
            const newItem = {
                id: product.id,
                title: product.title,
                price: product.price,
                mainImage: product.mainImage
            };
            setWishlist([...wishlist, newItem]);
        }

        setTimeout(() => {
            setIsAnimatingWishlist(false);
        }, 1000);
    };

    const removeFromWishlist = (id: number) => {
        setWishlist(wishlist.filter(item => item.id !== id));
    };

    const isInWishlist = (id: number) => {
        return wishlist.some(item => item.id === id);
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