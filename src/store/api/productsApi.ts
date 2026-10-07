import { getProducts, getProductsByIds, getSearchSuggestions } from "@/lib/services/products.service";
import type { Paginated, Product, ProductFilters } from "@/types/shop";
import { baseApi } from "./baseApi";
import { run } from "./helpers";

export const productsApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    getProducts: b.query<Paginated<Product>, ProductFilters | void>({
      queryFn: (filters) => run(() => getProducts(filters ?? {})),
      providesTags: ["Product"],
    }),
    getProductsByIds: b.query<Product[], string[]>({
      queryFn: (ids) => run(() => getProductsByIds(ids), 300),
      providesTags: ["Product"],
    }),
    getSearchSuggestions: b.query<Product[], string>({
      queryFn: (q) => run(() => getSearchSuggestions(q), 200),
    }),
  }),
});

export const { useGetProductsQuery, useGetProductsByIdsQuery, useGetSearchSuggestionsQuery } = productsApi;