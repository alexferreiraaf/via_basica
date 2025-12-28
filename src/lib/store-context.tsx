'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Product, CartItem, StoreConfig } from './types';
import { INITIAL_PRODUCTS } from './initial-data';
import { useToast } from '@/hooks/use-toast';

interface StoreContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, delta: number) => void;
  cartCount: number;
  cartTotal: number;
  storeConfig: StoreConfig;
  setStoreConfig: React.Dispatch<React.SetStateAction<StoreConfig>>;
  clearCart: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const useLocalStorage = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useLocalStorage<Product[]>('products', INITIAL_PRODUCTS);
  const [cart, setCart] = useLocalStorage<CartItem[]>('cart', []);
  const [storeConfig, setStoreConfig] = useLocalStorage<StoreConfig>('storeConfig', {
    name: "Livraria VB",
    phone: "14996295234",
    whatsappMessage: "Olá! Gostaria de fazer o seguinte pedido:"
  });
  const { toast } = useToast();

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    toast({
      title: "Adicionado ao carrinho",
      description: `${product.title} foi adicionado.`,
    })
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const clearCart = () => {
    setCart([]);
  }

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const value = {
    products,
    setProducts,
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    cartCount,
    cartTotal,
    storeConfig,
    setStoreConfig,
    clearCart,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
