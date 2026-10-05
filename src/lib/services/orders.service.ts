import { orders } from "@/data/orders";
import type { Order, OrderFilters, OrderStatus, Paginated } from "@/types/shop";

const DEFAULT_PAGE_SIZE = 10;

export async function getOrders(
  filters: OrderFilters = {},
): Promise<Paginated<Order>> {
  const { status = "all", q, page = 1, pageSize = DEFAULT_PAGE_SIZE } = filters;
  let list = [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  if (status !== "all") list = list.filter((o) => o.status === status);
  if (q?.trim()) {
    const term = q.trim().toLowerCase();
    list = list.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(term) ||
        o.customerName.toLowerCase().includes(term) ||
        o.phone.includes(term),
    );
  }

  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  return {
    items: list.slice(start, start + pageSize),
    total,
    page: safePage,
    pageSize,
    totalPages,
  };
}

export async function getOrderById(id: string): Promise<Order | null> {
  return orders.find((o) => o.id === id) ?? null;
}

// কাস্টমারের অর্ডার ট্র্যাকিং: অর্ডার নম্বর + ফোন নম্বর মিললে দেখাবে
export async function trackOrder(
  orderNumber: string,
  phone: string,
): Promise<Order | null> {
  const o = orders.find(
    (x) => x.orderNumber.toLowerCase() === orderNumber.trim().toLowerCase(),
  );
  return o && o.phone === phone.trim() ? o : null;
}

export async function getOrdersByCustomer(
  customerId: string,
): Promise<Order[]> {
  return orders.filter((o) => o.customerId === customerId);
}

export async function getRecentOrders(limit = 6): Promise<Order[]> {
  return [...orders]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);
}

// ফেক: ইন-মেমোরিতে বদলায়। আসল ব্যাকএন্ডে এটা PATCH /orders/:id হবে
export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<Order> {
  const order = orders.find((o) => o.id === id);
  if (!order) throw new Error("অর্ডার পাওয়া যায়নি");
  order.status = status;
  order.timeline = [
    ...order.timeline,
    { status, at: new Date().toISOString() },
  ];
  return order;
}
