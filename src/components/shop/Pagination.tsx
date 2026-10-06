import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/bn";
import { LocaleLink } from "@/i18n/LocaleLink";
import { formatNumber } from "@/lib/format";
import { buildHref } from "@/lib/product-query";

type Props = {
  page: number;
  totalPages: number;
  basePath: string;
  current: Record<string, string>;
  dict: Dictionary;
  locale: Locale;
};

// 1 … 4 [5] 6 … 20 ধরনের তালিকা
function windowed(page: number, total: number): (number | "gap")[] {
  const set = new Set(
    [1, total, page - 1, page, page + 1].filter((n) => n >= 1 && n <= total),
  );
  const sorted = [...set].sort((a, b) => a - b);
  const out: (number | "gap")[] = [];
  sorted.forEach((n, i) => {
    if (i > 0 && n - sorted[i - 1] > 1) out.push("gap");
    out.push(n);
  });
  return out;
}

export function Pagination({
  page,
  totalPages,
  basePath,
  current,
  dict,
  locale,
}: Props) {
  if (totalPages <= 1) return null;
  const href = (p: number) =>
    buildHref(basePath, current, { page: p > 1 ? p : undefined });
  const cell =
    "grid h-10 min-w-10 place-items-center rounded-full px-3 text-sm font-medium transition-colors";

  return (
    <nav
      aria-label={dict.listing.page}
      className="mt-12 flex items-center justify-center gap-1.5"
    >
      {page > 1 ? (
        <LocaleLink
          href={href(page - 1)}
          aria-label={dict.listing.prev}
          className={`${cell} border border-border hover:bg-muted`}
        >
          <ChevronLeft className="size-4 rtl:rotate-180" />
        </LocaleLink>
      ) : (
        <span className={`${cell} border border-border opacity-40`} aria-hidden>
          <ChevronLeft className="size-4 rtl:rotate-180" />
        </span>
      )}

      {windowed(page, totalPages).map((n, i) =>
        n === "gap" ? (
          <span
            key={`gap-${i}`}
            className="px-1 text-muted-foreground"
            aria-hidden
          >
            …
          </span>
        ) : n === page ? (
          <span
            key={n}
            aria-current="page"
            className={`${cell} bg-primary text-primary-foreground`}
          >
            {formatNumber(n, locale)}
          </span>
        ) : (
          <LocaleLink
            key={n}
            href={href(n)}
            className={`${cell} hover:bg-muted`}
          >
            {formatNumber(n, locale)}
          </LocaleLink>
        ),
      )}

      {page < totalPages ? (
        <LocaleLink
          href={href(page + 1)}
          aria-label={dict.listing.next}
          className={`${cell} border border-border hover:bg-muted`}
        >
          <ChevronRight className="size-4 rtl:rotate-180" />
        </LocaleLink>
      ) : (
        <span className={`${cell} border border-border opacity-40`} aria-hidden>
          <ChevronRight className="size-4 rtl:rotate-180" />
        </span>
      )}
    </nav>
  );
}
