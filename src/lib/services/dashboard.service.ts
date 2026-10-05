import { customers } from "@/data/customers";
import { orders } from "@/data/orders";
import { products } from "@/data/products";
import type {
  DashboardStats,
  OrderStatus,
  Product,
  SalesPoint,
  StatusBreakdown,
} from "@/types/shop";

export async function getDashboardStats(): Promise<DashboardStats> {
  // সংখ্যাগুলো ৩০ দিনের সেলস সিরিজ থেকে, যাতে চার্টের সাথে মেলে
  const series = await getSalesSeries(30);
  const revenue = series.reduce((n, d) => n + d.revenue, 0);
  const orderCount = series.reduce((n, d) => n + d.orders, 0);
  return {
    // change (%) এখন ফেক, আসল ডেটায় আগের সময়ের সাথে তুলনা হবে
    revenue: { value: revenue, change: 12.4 },
    orders: { value: orderCount, change: 8.1 },
    customers: { value: customers.length, change: 4.6 },
    avgOrderValue: {
      value: orderCount ? Math.round(revenue / orderCount) : 0,
      change: -2.3,
    },
    pendingOrders: orders.filter((o) => o.status === "pending").length,
    lowStockProducts: products.filter((p) => p.stock <= 10).length,
  };
}

// গত N দিনের বিক্রয় (ডিটারমিনিস্টিক ফেক সিরিজ)
export async function getSalesSeries(days = 30): Promise<SalesPoint[]> {
  const end = new Date("2026-10-01T00:00:00+06:00").getTime();
  return Array.from({ length: days }, (_, i) => {
    const d = days - 1 - i;
    const wave = Math.sin(i / 3) * 0.25 + Math.cos(i / 7) * 0.15;
    const trend = 1 + i / (days * 2);
    const count = Math.max(2, Math.round(9 * (1 + wave) * trend));
    return {
      date: new Date(end - d * 86_400_000).toISOString().slice(0, 10),
      orders: count,
      revenue: count * (2100 + ((i * 97) % 700)),
    };
  });
}

export async function getTopProducts(limit = 5): Promise<Product[]> {
  return [...products].sort((a, b) => b.sold - a.sold).slice(0, limit);
}

export async function getLowStockProducts(limit = 5): Promise<Product[]> {
  return products
    .filter((p) => p.stock <= 10)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, limit);
}

export async function getStatusBreakdown(): Promise<StatusBreakdown[]> {
  const all: OrderStatus[] = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "returned",
  ];
  return all.map((status) => ({
    status,
    count: orders.filter((o) => o.status === status).length,
  }));
}
