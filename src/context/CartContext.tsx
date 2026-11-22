"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getProductBySlug } from "@/data/products";
import type { CartItem, Product } from "@/lib/types";

const STORAGE_KEY = "epure-cart-v1";

export interface CartLine extends CartItem {
  product: Product;
}

interface CartContextValue {
  items: CartItem[];
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
  hydrated: boolean;
  addItem: (slug: string, quantity?: number) => void;
  removeItem: (slug: string) => void;
  setQuantity: (slug: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function normalizeItems(items: CartItem[]): CartItem[] {
  return items
    .filter((item) => item.quantity > 0 && getProductBySlug(item.slug))
    .map((item) => ({
      slug: item.slug,
      quantity: Math.min(99, Math.max(1, Math.floor(item.quantity))),
    }));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) {
          setItems(normalizeItems(parsed));
        }
      }
    } catch {
      // Ignore corrupt storage; start empty.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback((slug: string, quantity = 1) => {
    if (!getProductBySlug(slug)) return;
    setItems((prev) => {
      const existing = prev.find((item) => item.slug === slug);
      if (existing) {
        return normalizeItems(
          prev.map((item) =>
            item.slug === slug
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          ),
        );
      }
      return normalizeItems([...prev, { slug, quantity }]);
    });
  }, []);

  const removeItem = useCallback((slug: string) => {
    setItems((prev) => prev.filter((item) => item.slug !== slug));
  }, []);

  const setQuantity = useCallback((slug: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.slug !== slug));
      return;
    }
    setItems((prev) =>
      normalizeItems(
        prev.map((item) => (item.slug === slug ? { ...item, quantity } : item)),
      ),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const lines = useMemo<CartLine[]>(
    () =>
      items
        .map((item) => {
          const product = getProductBySlug(item.slug);
          if (!product) return null;
          return { ...item, product };
        })
        .filter((line): line is CartLine => line !== null),
    [items],
  );

  const itemCount = useMemo(
    () => lines.reduce((sum, line) => sum + line.quantity, 0),
    [lines],
  );

  const subtotal = useMemo(
    () => lines.reduce((sum, line) => sum + line.product.priceZar * line.quantity, 0),
    [lines],
  );

  const value = useMemo(
    () => ({
      items,
      lines,
      itemCount,
      subtotal,
      hydrated,
      addItem,
      removeItem,
      setQuantity,
      clearCart,
    }),
    [items, lines, itemCount, subtotal, hydrated, addItem, removeItem, setQuantity, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
