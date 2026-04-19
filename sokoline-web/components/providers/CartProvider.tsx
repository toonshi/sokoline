"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useAuth } from "@clerk/nextjs";
import { Cart, CartItem } from "@/lib/types";
import { fetchCart, addToCart, removeFromCart, updateCartItem } from "@/lib/api";

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  addItem: (productId: number, quantity?: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const { getToken, isLoaded, isSignedIn } = useAuth();

  const refreshCart = async () => {
    if (!isSignedIn) {
      setCart(null);
      setLoading(false);
      return;
    }

    try {
      const token = await getToken();
      if (token) {
        const data = await fetchCart(token);
        setCart(data);
      }
    } catch (error) {
      console.error("Failed to refresh cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded) {
      refreshCart();
    }
  }, [isLoaded, isSignedIn]);

  const addItem = async (productId: number, quantity: number = 1) => {
    if (!isSignedIn) {
      // For now, only authenticated users can use the cart
      alert("Please sign in to add items to your cart.");
      return;
    }

    try {
      const token = await getToken();
      if (token) {
        const success = await addToCart(token, productId, quantity);
        if (success) {
          await refreshCart();
        }
      }
    } catch (error) {
      console.error("Failed to add item:", error);
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      const token = await getToken();
      if (token) {
        const success = await removeFromCart(token, itemId);
        if (success) {
          await refreshCart();
        }
      }
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(itemId);
      return;
    }

    try {
      const token = await getToken();
      if (token) {
        const success = await updateCartItem(token, itemId, quantity);
        if (success) {
          await refreshCart();
        }
      }
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, loading, addItem, removeItem, updateQuantity, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
