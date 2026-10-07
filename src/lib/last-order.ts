import type { Order } from "@/types/shop";

const KEY = "last-order:v1";

// অর্ডার সফল পেজ দেখানোর জন্য সর্বশেষ অর্ডার ব্রাউজারের sessionStorage এ রাখা হয়
export function saveLastOrder(order: Order) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(order));
  } catch {}
}

export function loadLastOrder(): Order | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Order) : null;
  } catch {
    return null;
  }
}
