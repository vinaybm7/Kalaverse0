import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface CartItem {
  id: number;
  title: string;
  artist: string;
  category: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, onAuthRequired?: () => void) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('kalaverse-cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('kalaverse-cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (newItem: Omit<CartItem, 'quantity'>, onAuthRequired?: () => void) => {
    // Check if user is authenticated
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to add items to your cart.",
        variant: "destructive"
      });
      
      // Call the callback to open auth modal if provided
      if (onAuthRequired) {
        onAuthRequired();
      }
      return;
    }

    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === newItem.id);
      
      if (existingItem) {
        toast({
          title: "Updated Cart",
          description: `Increased quantity of ${newItem.title} in your cart.`
        });
        return prevItems.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        toast({
          title: "Added to Cart",
          description: `${newItem.title} by ${newItem.artist} has been added to your cart.`
        });
        return [...prevItems, { ...newItem, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id: number) => {
    setItems(prevItems => {
      const item = prevItems.find(item => item.id === id);
      if (item) {
        toast({
          title: "Removed from Cart",
          description: `${item.title} has been removed from your cart.`
        });
      }
      return prevItems.filter(item => item.id !== id);
    });
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart."
    });
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        isOpen,
        setIsOpen
      }}
    >
      {children}
    </CartContext.Provider>
  );
};