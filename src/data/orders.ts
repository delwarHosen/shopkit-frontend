import type {
  CourierName,
  Order,
  OrderEvent,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from "@/types/shop";
import { customers } from "./customers";
import { products } from "./products";

// সিডেড র‍্যান্ডম, যাতে সার্ভার ও ক্লায়েন্টে একই ডেটা আসে
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(2026);
const pick = <T>(arr: readonly T[]): T => arr[Math.floor(rand() * arr.length)];

const BASE = new Date("2026-10-01T10:00:00+06:00").getTime();
const HOUR = 3_600_000;

const places = [
  { thana: "ধানমন্ডি", district: "Dhaka", division: "Dhaka" },
  { thana: "মিরপুর", district: "Dhaka", division: "Dhaka" },
  { thana: "পাঁচলাইশ", district: "Chattogram", division: "Chattogram" },
  { thana: "কোতোয়ালি", district: "Sylhet", division: "Sylhet" },
  { thana: "বোয়ালিয়া", district: "Rajshahi", division: "Rajshahi" },
  { thana: "সোনাডাঙ্গা", district: "Khulna", division: "Khulna" },
  { thana: "গাজীপুর সদর", district: "Gazipur", division: "Dhaka" },
];

const steps: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
];
const methods: PaymentMethod[] = [
  "cod",
  "cod",
  "bkash",
  "bkash",
  "nagad",
  "card",
];
const couriers: CourierName[] = ["steadfast", "pathao", "redx"];

function statusForAge(hours: number): OrderStatus {
  if (hours < 24) return pick<OrderStatus>(["pending", "pending", "confirmed"]);
  if (hours < 48) return pick<OrderStatus>(["confirmed", "processing"]);
  if (hours < 96)
    return pick<OrderStatus>(["processing", "shipped", "shipped"]);
  return pick<OrderStatus>([
    "delivered",
    "delivered",
    "delivered",
    "delivered",
    "delivered",
    "delivered",
    "delivered",
    "delivered",
    "delivered",
    "delivered",
    "delivered",
    "delivered",
    "cancelled",
    "returned",
  ]);
}

function buildTimeline(status: OrderStatus, createdAt: number): OrderEvent[] {
  const mk = (s: OrderStatus, offset: number, note?: string): OrderEvent => ({
    status: s,
    at: new Date(createdAt + offset * HOUR).toISOString(),
    note,
  });
  if (status === "cancelled")
    return [mk("pending", 0), mk("cancelled", 5, "কাস্টমারের অনুরোধে বাতিল")];
  const upTo = status === "returned" ? 4 : steps.indexOf(status);
  const tl = steps.slice(0, upTo + 1).map((s, i) => mk(s, i * 14));
  if (status === "returned")
    tl.push(mk("returned", 4 * 14 + 30, "পণ্য ফেরত এসেছে"));
  return tl;
}

export const orders: Order[] = Array.from({ length: 28 }, (_, i) => {
  const ageHours = i * 12 + Math.floor(rand() * 8);
  const createdAt = BASE - ageHours * HOUR;
  const customer = customers[Math.floor(rand() * customers.length)];
  const place = pick(places);
  const status = statusForAge(ageHours);
  const method = pick(methods);

  const items = Array.from({ length: 1 + Math.floor(rand() * 3) }, () => {
    const p = pick(products);
    const variant =
      p.options.map((o) => pick(o.values)).join(" / ") || undefined;
    return {
      productId: p.id,
      name: p.name,
      image: p.images[0],
      price: p.price,
      quantity: 1 + Math.floor(rand() * 2),
      variant,
    };
  });

  const subtotal = items.reduce((n, it) => n + it.price * it.quantity, 0);
  const shipping = place.district === "Dhaka" ? 60 : 120;
  const discount = rand() < 0.25 ? Math.round(subtotal * 0.05) : 0;

  const paymentStatus: PaymentStatus =
    method === "cod"
      ? status === "delivered"
        ? "paid"
        : "unpaid"
      : status === "cancelled" || status === "returned"
        ? "refunded"
        : "paid";

  const hasCourier = ["shipped", "delivered", "returned"].includes(status);
  const courier = hasCourier ? pick(couriers) : undefined;

  return {
    id: `o-${1001 + i}`,
    orderNumber: `ORD-${1001 + i}`,
    customerId: customer.id,
    customerName: customer.name,
    phone: customer.phone,
    address: {
      line: `বাসা ${10 + Math.floor(rand() * 80)}, রোড ${1 + Math.floor(rand() * 20)}`,
      ...place,
    },
    items,
    subtotal,
    shipping,
    discount,
    total: subtotal + shipping - discount,
    paymentMethod: method,
    paymentStatus,
    status,
    courier,
    trackingId: courier
      ? `${courier.slice(0, 2).toUpperCase()}${100000 + Math.floor(rand() * 899999)}`
      : undefined,
    createdAt: new Date(createdAt).toISOString(),
    timeline: buildTimeline(status, createdAt),
  };
});
