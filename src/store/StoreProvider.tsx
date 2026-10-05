"use client";

import { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, type AppStore } from "./index";
import { hydrate, type CartItem } from "./slices/cartSlice";

const CART_KEY = "cart:v1";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) storeRef.current = makeStore();
  const store = storeRef.current;

  // কার্ট localStorage থেকে লোড ও সেভ (hydration mismatch এড়াতে useEffect এ)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      store.dispatch(hydrate(raw ? (JSON.parse(raw) as CartItem[]) : []));
    } catch {
      store.dispatch(hydrate([]));
    }

    let prev = store.getState().cart.items;
    return store.subscribe(() => {
      const { items, hydrated } = store.getState().cart;
      if (!hydrated || items === prev) return;
      prev = items;
      try {
        localStorage.setItem(CART_KEY, JSON.stringify(items));
      } catch {}
    });
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
}
