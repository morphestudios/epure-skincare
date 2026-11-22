"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { getProductBySlug } from "@/data/products";
import type { CartItem, Product } from "@/lib/types";

const STORAGE_KEY = "epure-cart-v1";

/** Stable empty snapshot for SSR / empty cart — never recreate per call. */
const EMPTY_CART: CartItem[] = [];

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

/** Cache so getSnapshot returns the same reference when localStorage is unchanged. */
let cachedRaw: string | null = null;
let cachedItems: CartItem[] = EMPTY_CART;

function normalizeItems(items: CartItem[]): CartItem[] {
  return items
    .filter((item) => item.quantity > 0 && getProductBySlug(item.slug))
    .map((item) => ({
      slug: item.slug,
      quantity: Math.min(99, Math.max(1, Math.floor(item.quantity))),
    }));
}

function getCartSnapshot(): CartItem[] {
  if (typeof window === "undefined") {
    return EMPTY_CART;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === cachedRaw) {
      return cachedItems;
    }

    cachedRaw = raw;

    if (!raw) {
      cachedItems = EMPTY_CART;
      return cachedItems;
    }

    const parsed = JSON.parse(raw) as CartItem[];
    if (!Array.isArray(parsed)) {
      cachedItems = EMPTY_CART;
      return cachedItems;
    }

    const next = normalizeItems(parsed);
    cachedItems = next.length === 0 ? EMPTY_CART : next;
    return cachedItems;
  } catch {
    cachedRaw = null;
    cachedItems = EMPTY_CART;
    return cachedItems;
  }
}

function getServerCartSnapshot(): CartItem[] {
  return EMPTY_CART;
}

function getClientHydratedSnapshot(): boolean {
  return true;
}

function getServerHydratedSnapshot(): boolean {
  return false;
}

function writeCart(items: CartItem[]) {
  const normalized = normalizeItems(items);
  const raw = JSON.stringify(normalized);
  window.localStorage.setItem(STORAGE_KEY, raw);
  cachedRaw = raw;
  cachedItems = normalized.length === 0 ? EMPTY_CART : normalized;
  window.dispatchEvent(new Event("epure-cart"));
}

function subscribe(onStoreChange: () => void) {
  const handler = () => onStoreChange();
  window.addEventListener("storage", handler);
  window.addEventListener("epure-cart", handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener("epure-cart", handler);
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(
    subscribe,
    getCartSnapshot,
    getServerCartSnapshot,
  );
  const hydrated = useSyncExternalStore(
    subscribe,
    getClientHydratedSnapshot,
    getServerHydratedSnapshot,
  );

  const addItem = useCallback((slug: string, quantity = 1) => {
    if (!getProductBySlug(slug)) return;
    const prev = getCartSnapshot();
    const existing = prev.find((item) => item.slug === slug);
    const next = existing
      ? normalizeItems(
          prev.map((item) =>
            item.slug === slug
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          ),
        )
      : normalizeItems([...prev, { slug, quantity }]);
    writeCart(next);
  }, []);

  const removeItem = useCallback((slug: string) => {
    writeCart(getCartSnapshot().filter((item) => item.slug !== slug));
  }, []);

  const setQuantity = useCallback((slug: string, quantity: number) => {
    if (quantity <= 0) {
      writeCart(getCartSnapshot().filter((item) => item.slug !== slug));
      return;
    }
    writeCart(
      normalizeItems(
        getCartSnapshot().map((item) =>
          item.slug === slug ? { ...item, quantity } : item,
        ),
      ),
    );
  }, []);

  const clearCart = useCallback(() => writeCart([]), []);

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
    () =>
      lines.reduce(
        (sum, line) => sum + line.product.priceZar * line.quantity,
        0,
      ),
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
    [
      items,
      lines,
      itemCount,
      subtotal,
      hydrated,
      addItem,
      removeItem,
      setQuantity,
      clearCart,
    ],
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
