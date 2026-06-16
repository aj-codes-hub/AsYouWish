import React, { createContext, useContext, useState } from 'react'



interface wishlistItemType {
    id: number;
    title: string;
    price: number;
    mainImage: string;
}

interface wishlistContextType {
    wishlist: wishlistItemType[];
    addToWishlist: (product: any) => void;
    removeFromWishlist: (id: number) => void;
    isInWishlist: (id: number) => boolean;
    totalWishlistItems: number;
    isAnimatingwishlist: boolean;
}


const wishlistContext = createContext<wishlistContextType | undefined>(undefined);

export const WishlistProvider = ({children} : {children : React.ReactNode}) => {

const [wishlist, setWishlist] = useState<wishlistItemType[]>([]);
const [isAnimatingwishlist, setIsAnimatingwishlist] = useState(false);


const addToWishlist = (product: any) => {

    const exists = wishlist.find(item => item.id === product.id);
    if(!exists){
      const newItem = {
        id: product.id,
        title: product.title,
        price: product.price,
        mainImage: product.mainImage,
      }
      setTimeout(()=>{
       setWishlist([...wishlist,newItem]);
       },1000);
      setIsAnimatingwishlist(true);
      setTimeout(() => {
        setIsAnimatingwishlist(false);
      },1400);
  
    }
};


const isInWishlist = (id: number) => {
     return wishlist.some(item => item.id === id);
}

const removeFromWishlist = (id: number) => {
    setWishlist(wishlist.filter(item => item.id !== id));
}

const totalWishlistItems = wishlist.length;


return (
     <wishlistContext.Provider value={{wishlist,totalWishlistItems,removeFromWishlist,addToWishlist,isInWishlist,isAnimatingwishlist}}>
        {children}
     </wishlistContext.Provider>
);

}

export const useWishlist = () => {
    const context = useContext(wishlistContext);
    if(!context){
     throw new Error('useWishlist must be used within WishlistProvider')
    }
    return context;
};