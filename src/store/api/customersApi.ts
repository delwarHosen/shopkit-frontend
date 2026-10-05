import { getCustomers } from "@/lib/services/customers.service";
import type {
  CustomerFilters,
  CustomerWithStats,
  Paginated,
} from "@/types/shop";
import { baseApi } from "./baseApi";
import { run } from "./helpers";

export const customersApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    getCustomers: b.query<Paginated<CustomerWithStats>, CustomerFilters | void>(
      {
        queryFn: (filters) => run(() => getCustomers(filters ?? {})),
        providesTags: ["Customer"],
      },
    ),
  }),
});

export const { useGetCustomersQuery } = customersApi;
