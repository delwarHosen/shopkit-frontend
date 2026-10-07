import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api/baseApi";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import uiReducer from "./slices/uiSlice";
import wishlistReducer from "./slices/wishlistSlice";

// Next.js App Router এ প্রতি রিকোয়েস্টে নতুন স্টোর লাগে, তাই ফাংশন
export const makeStore = () =>
  configureStore({
    reducer: {
      cart: cartReducer,
      wishlist: wishlistReducer,
      auth: authReducer,
      ui: uiReducer,
      [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefault) => getDefault().concat(baseApi.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];