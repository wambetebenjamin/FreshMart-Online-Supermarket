"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  slug: string;
  name: string;
  unit: string;
  image: string;
  price: number; // effective unit price (deal price if on deal)
  qty: number;
}

interface CartState {
  items: CartItem[];
  drawerOpen: boolean;
  lastAddedAt: number; // timestamp of last add — drives the spring badge animation
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  remove: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      drawerOpen: false,
      lastAddedAt: 0,
      add: (item, qty = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.slug === item.slug);
          const items = existing
            ? state.items.map((i) =>
                i.slug === item.slug ? { ...i, qty: Math.min(99, i.qty + qty) } : i
              )
            : [...state.items, { ...item, qty }];
          return { items, lastAddedAt: Date.now() };
        }),
      remove: (slug) =>
        set((state) => ({ items: state.items.filter((i) => i.slug !== slug) })),
      setQty: (slug, qty) =>
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter((i) => i.slug !== slug)
              : state.items.map((i) =>
                  i.slug === slug ? { ...i, qty: Math.min(99, qty) } : i
                ),
        })),
      clear: () => set({ items: [] }),
      openDrawer: () => set({ drawerOpen: true }),
      closeDrawer: () => set({ drawerOpen: false }),
    }),
    {
      name: "fm-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export function cartCount(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.qty, 0);
}

export function cartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.price * i.qty, 0);
}
