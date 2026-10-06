"use client";

import { Star } from "lucide-react";
import { useLocale } from "@/i18n/I18nProvider";

const five = [0, 1, 2, 3, 4];

export function Stars({
  rating,
  count,
  className = "",
}: {
  rating: number;
  count?: number;
  className?: string;
}) {
  const locale = useLocale();
  const label = rating.toLocaleString(locale === "bn" ? "bn-BD" : "en-BD", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs ${className}`}>
      <span
        className="relative inline-flex"
        role="img"
        aria-label={`${label} / 5`}
      >
        <span className="flex text-muted-foreground/30" aria-hidden>
          {five.map((i) => (
            <Star
              key={i}
              className="size-3.5 shrink-0"
              fill="currentColor"
              strokeWidth={0}
            />
          ))}
        </span>
        <span
          className="absolute inset-y-0 inset-s-0 flex overflow-hidden text-amber-400"
          style={{ width: `${(Math.min(5, Math.max(0, rating)) / 5) * 100}%` }}
          aria-hidden
        >
          {five.map((i) => (
            <Star
              key={i}
              className="size-3.5 shrink-0"
              fill="currentColor"
              strokeWidth={0}
            />
          ))}
        </span>
      </span>
      <span className="font-medium">{label}</span>
      {count != null && (
        <span className="text-muted-foreground">
          ({count.toLocaleString(locale === "bn" ? "bn-BD" : "en-BD")})
        </span>
      )}
    </span>
  );
}
