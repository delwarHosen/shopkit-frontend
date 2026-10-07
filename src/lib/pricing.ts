import { clientConfig } from "@/config/client";

/** জেলা অনুযায়ী ডেলিভারি চার্জ। জেলা না বাছা পর্যন্ত null */
export function calcShipping(
  district: string | undefined,
  subtotal: number,
): number | null {
  if (!district) return null;
  const { insideDhaka, outsideDhaka, freeOver } = clientConfig.shipping;
  if (freeOver > 0 && subtotal >= freeOver) return 0;
  return district === "Dhaka" ? insideDhaka : outsideDhaka;
}

type CouponRule =
  | { type: "percent"; value: number; max: number; min: number }
  | { type: "flat"; value: number; min: number }
  | { type: "shipping"; min: number };

// ডেমো কুপন। আসল সিস্টেমে এগুলো ডাটাবেস থেকে আসবে
export const COUPONS: Record<string, CouponRule> = {
  WELCOME10: { type: "percent", value: 10, max: 500, min: 1000 },
  FLAT100: { type: "flat", value: 100, min: 800 },
  FREESHIP: { type: "shipping", min: 0 },
};

export type CouponResult =
  | { ok: true; code: string; discount: number; freeShipping: boolean }
  | { ok: false; reason: "invalid" | "min"; min?: number };

export function applyCoupon(code: string, subtotal: number): CouponResult {
  const key = code.trim().toUpperCase();
  const rule = COUPONS[key];
  if (!rule) return { ok: false, reason: "invalid" };
  if (subtotal < rule.min) return { ok: false, reason: "min", min: rule.min };

  if (rule.type === "percent") {
    return {
      ok: true,
      code: key,
      discount: Math.min(rule.max, Math.round((subtotal * rule.value) / 100)),
      freeShipping: false,
    };
  }
  if (rule.type === "flat")
    return {
      ok: true,
      code: key,
      discount: Math.min(rule.value, subtotal),
      freeShipping: false,
    };
  return { ok: true, code: key, discount: 0, freeShipping: true };
}
