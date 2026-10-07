"use client";

import { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, type AppStore } from "./index";
import { hydrate as hydrateCart, type CartItem } from "./slices/cartSlice";
import { hydrateWishlist } from "./slices/wishlistSlice";
import { AuthUser, hydrateAuth } from "./slices/authSlice";


const KEYS = { cart: "cart:v1", wishlist: "wishlist:v1", auth: "auth:v1" } as const;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    if (value == null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) storeRef.current = makeStore();
  const store = storeRef.current;

  // কার্ট, উইশলিস্ট ও লগইন localStorage থেকে লোড ও সেভ (hydration mismatch এড়াতে useEffect এ)
  useEffect(() => {
    const cart = read<CartItem[]>(KEYS.cart, []);
    const wish = read<string[]>(KEYS.wishlist, []);
    store.dispatch(hydrateCart(Array.isArray(cart) ? cart : []));
    store.dispatch(hydrateWishlist(Array.isArray(wish) ? wish.filter((x) => typeof x === "string") : []));
    store.dispatch(hydrateAuth(read<AuthUser | null>(KEYS.auth, null)));

    let prev = store.getState();
    return store.subscribe(() => {
      const s = store.getState();
      if (s.cart.hydrated && s.cart.items !== prev.cart.items) write(KEYS.cart, s.cart.items);
      if (s.wishlist.hydrated && s.wishlist.ids !== prev.wishlist.ids) write(KEYS.wishlist, s.wishlist.ids);
      if (s.auth.hydrated && s.auth.user !== prev.auth.user) write(KEYS.auth, s.auth.user);
      prev = s;
    });
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
}