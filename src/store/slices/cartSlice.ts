import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type CartItem = {
  id: string; // productId + variant
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  variant?: string; // যেমন "L / কালো"
  quantity: number;
};

type CartState = { items: CartItem[]; hydrated: boolean };

const initialState: CartState = { items: [], hydrated: false };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    hydrate(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
      state.hydrated = true;
    },
    addItem(state, action: PayloadAction<Omit<CartItem, "quantity"> & { quantity?: number }>) {
      const { quantity = 1, ...item } = action.payload;
      const existing = state.items.find((i) => i.id === item.id);
      if (existing) existing.quantity += quantity;
      else state.items.push({ ...item, quantity });
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    setQuantity(state, action: PayloadAction<{ id: string; quantity: number }>) {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (!item) return;
      if (action.payload.quantity <= 0) {
        state.items = state.items.filter((i) => i.id !== item.id);
      } else {
        item.quantity = action.payload.quantity;
      }
    },
    clearCart(state) {
      state.items = [];
    },
  },
  selectors: {
    selectCartItems: (s) => s.items,
    selectCartCount: (s) => s.items.reduce((n, i) => n + i.quantity, 0),
    selectCartSubtotal: (s) => s.items.reduce((n, i) => n + i.price * i.quantity, 0),
  },
});

export const { hydrate, addItem, removeItem, setQuantity, clearCart } = cartSlice.actions;
export const { selectCartItems, selectCartCount, selectCartSubtotal } = cartSlice.selectors;
export default cartSlice.reducer;
