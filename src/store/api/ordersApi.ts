import {
  getOrderById,
  getOrders,
  updateOrderStatus,
} from "@/lib/services/orders.service";
import type { Order, OrderFilters, OrderStatus, Paginated } from "@/types/shop";
import { baseApi } from "./baseApi";
import { run } from "./helpers";

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    getOrders: b.query<Paginated<Order>, OrderFilters | void>({
      queryFn: (filters) => run(() => getOrders(filters ?? {})),
      providesTags: ["Order"],
    }),
    getOrder: b.query<Order | null, string>({
      queryFn: (id) => run(() => getOrderById(id)),
      providesTags: (_r, _e, id) => [{ type: "Order", id }],
    }),
    updateOrderStatus: b.mutation<Order, { id: string; status: OrderStatus }>({
      queryFn: ({ id, status }) =>
        run(() => updateOrderStatus(id, status), 300),
      invalidatesTags: ["Order", "Stats"],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderQuery,
  useUpdateOrderStatusMutation,
} = ordersApi;
