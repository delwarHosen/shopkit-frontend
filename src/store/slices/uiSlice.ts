import { createSlice } from "@reduxjs/toolkit";

type UiState = {
  cartOpen: boolean;
  mobileMenuOpen: boolean;
  searchOpen: boolean;
  dashboardSidebarOpen: boolean;
};

const initialState: UiState = {
  cartOpen: false,
  mobileMenuOpen: false,
  searchOpen: false,
  dashboardSidebarOpen: true,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openCart: (s) => void (s.cartOpen = true),
    closeCart: (s) => void (s.cartOpen = false),
    toggleMobileMenu: (s) => void (s.mobileMenuOpen = !s.mobileMenuOpen),
    toggleSearch: (s) => void (s.searchOpen = !s.searchOpen),
    toggleDashboardSidebar: (s) => void (s.dashboardSidebarOpen = !s.dashboardSidebarOpen),
  },
});

export const { openCart, closeCart, toggleMobileMenu, toggleSearch, toggleDashboardSidebar } =
  uiSlice.actions;
export default uiSlice.reducer;
