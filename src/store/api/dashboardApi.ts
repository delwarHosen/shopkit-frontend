import {
  getDashboardStats,
  getLowStockProducts,
  getSalesSeries,
  getStatusBreakdown,
  getTopProducts,
} from "@/lib/services/dashboard.service";
import { getRecentOrders } from "@/lib/services/orders.service";
import type {
  DashboardStats,
  Order,
  Product,
  SalesPoint,
  StatusBreakdown,
} from "@/types/shop";
import { baseApi } from "./baseApi";
import { run } from "./helpers";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    getDashboardStats: b.query<DashboardStats, void>({
      queryFn: () => run(getDashboardStats),
      providesTags: ["Stats"],
    }),
    getSalesSeries: b.query<SalesPoint[], number | void>({
      queryFn: (days) => run(() => getSalesSeries(days ?? 30)),
      providesTags: ["Stats"],
    }),
    getTopProducts: b.query<Product[], void>({
      queryFn: () => run(() => getTopProducts(5)),
    }),
    getLowStockProducts: b.query<Product[], void>({
      queryFn: () => run(() => getLowStockProducts(5)),
    }),
    getStatusBreakdown: b.query<StatusBreakdown[], void>({
      queryFn: () => run(getStatusBreakdown),
      providesTags: ["Stats"],
    }),
    getRecentOrders: b.query<Order[], void>({
      queryFn: () => run(() => getRecentOrders(6)),
      providesTags: ["Order"],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetSalesSeriesQuery,
  useGetTopProductsQuery,
  useGetLowStockProductsQuery,
  useGetStatusBreakdownQuery,
  useGetRecentOrdersQuery,
} = dashboardApi;
