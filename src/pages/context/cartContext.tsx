import React, { createContext, useContext, useState } from 'react'



interface cartItemType {
    id: number;
    title: string;
    mainImage: string;
    price: number;
    quantity: number;
}

interface cartContextType {
    cart: cartItemType[];
    addToCart:(product: any) => void;
    removeFromCart:(id: number) => void;
    updateQuantity: (id: number, quantity: number) => void;
    totalPrice: number;
    totalItems: number;
    isAnimating: boolean;
}

const cartContext = createContext<cartContextType | undefined>(undefined);

export const CartProvider = ({children}: {children: React.ReactNode}) => {

const [cart, setCart] = useState<cartItemType[]>([]);
const [isAnimating, setIsAnimating] = useState(false);

 const addToCart = (product: any) => {
     setTimeout(() => {
    const existingItem = cart.find(item => item.id === product.id);

    if(existingItem){
      const updateCart = cart.map(item => 
        item.id === product.id 
        ? {...item, quantity: item.quantity + 1}
        : item
      );
      setCart(updateCart);
    }
    else{
      const newItem = {
        id: product.id,
        title: product.title,
        price: product.price,
        mainImage: product.mainImage,
        quantity: 1,
      }
      setCart([...cart, newItem]);
    }
    },1000);
    setIsAnimating(true)

    setTimeout(()=>{
       setIsAnimating(false);
    },1400);

 }

const removeFromCart = (id: number) => {

    const updateCart = cart.filter(item => item.id !== id);
    setCart(updateCart);
}

const updateQuantity = (id: number, quantity: number) =>{

    if(quantity <= 0) {
      removeFromCart(id);
      return;
    }

    const updateCart = cart.map(item => 
       item.id === id ? {...item,quantity: quantity, } : item
    );
   setCart(updateCart)
} 

const totalPrice = cart.reduce((sum, item) => sum + (item.quantity * item.price), 0);


const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);




return (
    <cartContext.Provider value={{totalItems, removeFromCart, addToCart, cart, totalPrice, updateQuantity, isAnimating}}>
        {children}
    </cartContext.Provider>
  ); 
};


export const useCart = () => {

    const context = useContext(cartContext);
   if(!context){
    throw new Error('useCart can be used with in cartprovider');
   }

   return(context);

}
