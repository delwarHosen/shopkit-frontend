import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type WishlistState = { ids: string[]; hydrated: boolean };

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: { ids: [], hydrated: false } as WishlistState,
  reducers: {
    hydrate(state, action: PayloadAction<string[]>) {
      state.ids = action.payload;
      state.hydrated = true;
    },
    toggle(state, action: PayloadAction<string>) {
      const i = state.ids.indexOf(action.payload);
      if (i >= 0) state.ids.splice(i, 1);
      else state.ids.unshift(action.payload);
    },
    clear(state) {
      state.ids = [];
    },
  },
  selectors: {
    selectWishlistIds: (s) => s.ids,
    selectWishlistCount: (s) => s.ids.length,
  },
});

export const {
  hydrate: hydrateWishlist,
  toggle: toggleWishlist,
  clear: clearWishlist,
} = wishlistSlice.actions;
export const { selectWishlistIds, selectWishlistCount } =
  wishlistSlice.selectors;
export default wishlistSlice.reducer;
