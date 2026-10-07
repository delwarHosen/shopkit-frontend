import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type AuthUser = { name: string; phone: string; email?: string };
type AuthState = { user: AuthUser | null; hydrated: boolean };

// ডেমো লগইন: ব্রাউজারে সেভ হয়। আসল সিস্টেমে সার্ভার-সাইড সেশন/টোকেন হবে
const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, hydrated: false } as AuthState,
  reducers: {
    hydrate(state, action: PayloadAction<AuthUser | null>) {
      state.user = action.payload;
      state.hydrated = true;
    },
    login(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
    },
    updateProfile(
      state,
      action: PayloadAction<{ name: string; email?: string }>,
    ) {
      if (state.user) state.user = { ...state.user, ...action.payload };
    },
    logout(state) {
      state.user = null;
    },
  },
});

export const {
  hydrate: hydrateAuth,
  login,
  updateProfile,
  logout,
} = authSlice.actions;
export default authSlice.reducer;
