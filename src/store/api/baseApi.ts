import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

/**
 * এখন ফেক ডেটা চলছে, তাই fakeBaseQuery।
 * আসল API বসানোর সময় শুধু baseQuery বদলাবেন:
 *   baseQuery: fetchBaseQuery({ baseUrl: "/api" })
 * এবং প্রতিটা endpoint-এ queryFn এর জায়গায় query: () => "/products" লিখবেন।
 *
 * endpoint গুলো আলাদা ফাইলে baseApi.injectEndpoints({...}) দিয়ে যোগ হবে
 * (productsApi.ts, ordersApi.ts ইত্যাদি, পরের সেকশনে)।
 */
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fakeBaseQuery<{ message: string }>(),
  tagTypes: ["Product", "Category", "Order", "Customer", "Stats"],
  endpoints: () => ({}),
});
