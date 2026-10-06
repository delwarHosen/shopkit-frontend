import { BadgeCheck } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/bn";
import { fill } from "@/i18n/i18n-utils";
import { formatDate, formatNumber } from "@/lib/format";
import type { Product, Review } from "@/types/shop";
import { Stars } from "./Stars";

// ডেমো: গড় রেটিং ও মোট সংখ্যা থেকে ৫-১ স্টারের একটা সম্ভাব্য বণ্টন বের করে।
// আসল রিভিউ ডেটাবেস যোগ হলে এটা আসল গণনা দিয়ে বদলে যাবে।
function distribution(rating: number, count: number) {
  const mean = (k: number) => {
    const w = [5, 4, 3, 2, 1].map((s) => Math.exp(k * s));
    const sum = w.reduce((a, b) => a + b, 0);
    return w.reduce((a, x, i) => a + x * (5 - i), 0) / sum;
  };
  let lo = -3,
    hi = 6;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (mean(mid) < rating) lo = mid;
    else hi = mid;
  }
  const w = [5, 4, 3, 2, 1].map((s) => Math.exp(((lo + hi) / 2) * s));
  const sum = w.reduce((a, b) => a + b, 0);
  const counts = w.map((x) => Math.round((x / sum) * count));
  counts[0] += count - counts.reduce((a, b) => a + b, 0);
  return counts.map((c, i) => ({ star: 5 - i, count: Math.max(0, c) }));
}

type Props = {
  product: Product;
  reviews: Review[];
  dict: Dictionary;
  locale: Locale;
};

export function ReviewsPanel({ product, reviews, dict, locale }: Props) {
  const dist = distribution(product.rating, product.reviewCount);
  const max = Math.max(1, ...dist.map((d) => d.count));
  const avg = product.rating.toLocaleString(
    locale === "bn" ? "bn-BD" : "en-BD",
    {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    },
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_1fr] lg:gap-12">
      <div>
        <div className="flex items-end gap-3">
          <span className="text-5xl font-bold leading-none">{avg}</span>
          <span className="pb-1 text-muted-foreground">
            / {formatNumber(5, locale)}
          </span>
        </div>
        <div className="mt-2">
          <Stars rating={product.rating} />
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {fill(dict.detail.basedOn, {
            n: formatNumber(product.reviewCount, locale),
          })}
        </p>
        <ul className="mt-5 space-y-2">
          {dist.map((d) => (
            <li key={d.star} className="flex items-center gap-3 text-sm">
              <span className="w-6 shrink-0 text-muted-foreground">
                {formatNumber(d.star, locale)}★
              </span>
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <span
                  className="block h-full rounded-full bg-amber-400"
                  style={{ width: `${(d.count / max) * 100}%` }}
                />
              </span>
              <span className="w-10 shrink-0 text-end text-muted-foreground">
                {formatNumber(d.count, locale)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <ul className="space-y-4">
        {reviews.map((r) => (
          <li
            key={r.id}
            className="rounded-(--radius) border border-border p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <Stars rating={r.rating} />
              <time
                dateTime={r.createdAt}
                className="text-xs text-muted-foreground"
              >
                {formatDate(r.createdAt, locale)}
              </time>
            </div>
            <p className="mt-3 text-sm leading-relaxed">{r.comment}</p>
            <p className="mt-3 flex items-center gap-2 text-xs">
              <span className="font-semibold">{r.author}</span>
              {r.verified && (
                <span className="flex items-center gap-1 text-primary">
                  <BadgeCheck className="size-3.5" /> {dict.home.verified}
                </span>
              )}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
