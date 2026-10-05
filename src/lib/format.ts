import { clientConfig } from "@/config/client";

type Locale = "bn" | "en";

const numberLocale = (l: Locale) => (l === "bn" ? "bn-BD" : "en-BD");

export function formatNumber(n: number, locale: Locale = "bn") {
  return n.toLocaleString(numberLocale(locale), { maximumFractionDigits: 0 });
}

export function formatPrice(amount: number, locale: Locale = "bn") {
  return `${clientConfig.currency.symbol}${formatNumber(amount, locale)}`;
}

export function formatDate(
  iso: string,
  locale: Locale = "bn",
  options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" },
) {
  return new Date(iso).toLocaleDateString(numberLocale(locale), {
    timeZone: "Asia/Dhaka",
    ...options,
  });
}

export function formatDateTime(iso: string, locale: Locale = "bn") {
  return formatDate(iso, locale, {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function discountPercent(price: number, comparePrice?: number) {
  if (!comparePrice || comparePrice <= price) return 0;
  return Math.round(((comparePrice - price) / comparePrice) * 100);
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));