// context/cartContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react'

interface cartItemType {
    id: number;
    title: string;
    mainImage: string;
    price: number;
    quantity: number;
}

interface cartContextType {
    cart: cartItemType[];
    addToCart: (product: any) => void;
    removeFromCart: (id: number) => void;
    updateQuantity: (id: number, quantity: number) => void;
    totalPrice: number;
    totalItems: number;
    isAnimating: boolean;
    clearCart: () => void;
    buyNowProduct: cartItemType | null;
    setBuyNowProduct: (product: cartItemType | null) => void;
    clearBuyNow: () => void;
}

const cartContext = createContext<cartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {

    const [buyNowProduct, setBuyNowProduct] = useState<cartItemType | null>(null);
    
    // ✅ LocalStorage se cart load karo
    const [cart, setCart] = useState<cartItemType[]>(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });
    
    const [isAnimating, setIsAnimating] = useState(false);

    // ✅ Jab bhi cart change ho, localStorage update karo
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    // ✅ BuyNowProduct bhi localStorage mein save karo
    useEffect(() => {
        if (buyNowProduct) {
            localStorage.setItem('buyNowProduct', JSON.stringify(buyNowProduct));
        } else {
            localStorage.removeItem('buyNowProduct');
        }
    }, [buyNowProduct]);

    // ✅ Page load pe buyNowProduct restore karo
    useEffect(() => {
        const savedBuyNow = localStorage.getItem('buyNowProduct');
        if (savedBuyNow) {
            setBuyNowProduct(JSON.parse(savedBuyNow));
        }
    }, []);

    const addToCart = (product: any) => {
        setIsAnimating(true);

        setTimeout(() => {
            const existingItem = cart.find(item => item.id === product.id);

            if (existingItem) {
                const updateCart = cart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
                setCart(updateCart);
            } else {
                const newItem = {
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    mainImage: product.mainImage,
                    quantity: 1,
                }
                setCart([...cart, newItem]);
            }
        }, 1000);

        setTimeout(() => {
            setIsAnimating(false);
        }, 1400);
    }

    const removeFromCart = (id: number) => {
        const updateCart = cart.filter(item => item.id !== id);
        setCart(updateCart);
    }

    const updateQuantity = (id: number, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(id);
            return;
        }

        const updateCart = cart.map(item =>
            item.id === id ? { ...item, quantity: quantity } : item
        );
        setCart(updateCart);
    }

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem('cart'); // ✅ Cart clear karte waqt localStorage bhi clear
    };

    const clearBuyNow = () => {
        setBuyNowProduct(null);
        localStorage.removeItem('buyNowProduct');
    };

    const totalPrice = cart.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <cartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            totalPrice,
            totalItems,
            isAnimating,
            clearCart,
            buyNowProduct,
            setBuyNowProduct,
            clearBuyNow
        }}>
            {children}
        </cartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(cartContext);
    if (!context) {
        throw new Error('useCart can be used with in cartprovider');
    }
    return context;
};