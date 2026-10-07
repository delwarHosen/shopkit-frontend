import { customers } from "@/data/customers";
import { orders } from "@/data/orders";
import { applyCoupon, calcShipping } from "@/lib/pricing";
import type { Address, Order, OrderFilters, OrderItem, OrderStatus, Paginated, PaymentMethod } from "@/types/shop";

const DEFAULT_PAGE_SIZE = 10;

export async function getOrders(filters: OrderFilters = {}): Promise<Paginated<Order>> {
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
  return { items: list.slice(start, start + pageSize), total, page: safePage, pageSize, totalPages };
}

export async function getOrderById(id: string): Promise<Order | null> {
  return orders.find((o) => o.id === id) ?? null;
}

// কাস্টমারের অর্ডার ট্র্যাকিং: অর্ডার নম্বর + ফোন নম্বর মিললে দেখাবে
export async function trackOrder(orderNumber: string, phone: string): Promise<Order | null> {
  const o = orders.find((x) => x.orderNumber.toLowerCase() === orderNumber.trim().toLowerCase());
  return o && o.phone === phone.trim() ? o : null;
}

export async function getOrdersByCustomer(customerId: string): Promise<Order[]> {
  return orders.filter((o) => o.customerId === customerId);
}

export async function getRecentOrders(limit = 6): Promise<Order[]> {
  return [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, limit);
}

// ফেক: ইন-মেমোরিতে বদলায়। আসল ব্যাকএন্ডে এটা PATCH /orders/:id হবে
export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
  const order = orders.find((o) => o.id === id);
  if (!order) throw new Error("অর্ডার পাওয়া যায়নি");
  order.status = status;
  order.timeline = [...order.timeline, { status, at: new Date().toISOString() }];
  return order;
}

/* ---------- নতুন অর্ডার ---------- */

export type OrderInput = {
  name: string;
  phone: string;
  email?: string;
  address: Address;
  items: OrderItem[];
  paymentMethod: PaymentMethod;
  trxId?: string;
  note?: string;
  couponCode?: string;
};

// ফেক: আসল ব্যাকএন্ডে এটা POST /orders হবে। দাম ও চার্জ এখানেই আবার হিসাব হয়,
// ব্রাউজার থেকে আসা মোট টাকা বিশ্বাস করা হয় না
export async function createOrder(input: OrderInput): Promise<Order> {
  if (input.items.length === 0) throw new Error("কার্ট খালি");

  const subtotal = input.items.reduce((n, it) => n + it.price * it.quantity, 0);
  const baseShipping = calcShipping(input.address.district, subtotal) ?? 0;
  const coupon = input.couponCode ? applyCoupon(input.couponCode, subtotal) : null;
  const shipping = coupon?.ok && coupon.freeShipping ? 0 : baseShipping;
  const discount = coupon?.ok ? coupon.discount : 0;

  const number = 1001 + orders.length;
  const now = new Date().toISOString();
  const known = customers.find((c) => c.phone === input.phone);

  const order: Order = {
    id: `o-${number}`,
    orderNumber: `ORD-${number}`,
    customerId: known?.id ?? "guest",
    customerName: input.name,
    phone: input.phone,
    email: input.email || undefined,
    address: input.address,
    items: input.items,
    subtotal,
    shipping,
    discount,
    total: subtotal + shipping - discount,
    paymentMethod: input.paymentMethod,
    // বিকাশ/নগদ: TrxID যাচাইয়ের আগে unpaid। কার্ড: ডেমোতে paid ধরা হয়
    paymentStatus: input.paymentMethod === "card" ? "paid" : "unpaid",
    status: "pending",
    trxId: input.trxId || undefined,
    note: input.note || undefined,
    couponCode: coupon?.ok ? coupon.code : undefined,
    createdAt: now,
    timeline: [{ status: "pending", at: now }],
  };

  orders.unshift(order);
  return order;
}