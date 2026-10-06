import { X } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/bn";
import { categoryLabel, fill } from "@/i18n/i18n-utils";
import { LocaleLink } from "@/i18n/LocaleLink";
import { formatPrice } from "@/lib/format";
import { buildHref, type ListingState, type Patch } from "@/lib/product-query";
import type { CategoryWithCount } from "@/types/shop";

type Props = {
  basePath: string;
  current: Record<string, string>;
  state: ListingState;
  categories: CategoryWithCount[];
  dict: Dictionary;
  locale: Locale;
  showCategory: boolean;
  showSale: boolean;
};

export function ActiveFilters({
  basePath,
  current,
  state,
  categories,
  dict,
  locale,
  showCategory,
  showSale,
}: Props) {
  const chips: { key: string; label: string; patch: Patch }[] = [];

  if (state.q)
    chips.push({ key: "q", label: `“${state.q}”`, patch: { q: undefined } });

  if (showCategory && state.category) {
    const c = categories.find((x) => x.slug === state.category);
    chips.push({
      key: "category",
      label: c ? categoryLabel(dict, c) : state.category,
      patch: { category: undefined },
    });
  }

  if (state.min != null || state.max != null) {
    const label =
      state.min != null && state.max != null
        ? `${formatPrice(state.min, locale)} – ${formatPrice(state.max, locale)}`
        : state.min != null
          ? fill(dict.listing.priceFrom, {
              price: formatPrice(state.min, locale),
            })
          : fill(dict.listing.priceUnder, {
              price: formatPrice(state.max!, locale),
            });
    chips.push({
      key: "price",
      label,
      patch: { min: undefined, max: undefined },
    });
  }

  if (state.inStock)
    chips.push({
      key: "stock",
      label: dict.listing.inStockOnly,
      patch: { inStock: false },
    });
  if (showSale && state.sale)
    chips.push({
      key: "sale",
      label: dict.listing.onSaleOnly,
      patch: { sale: false },
    });

  if (chips.length === 0) return null;

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      {chips.map((c) => (
        <LocaleLink
          key={c.key}
          href={buildHref(basePath, current, c.patch)}
          scroll={false}
          aria-label={`${dict.listing.removeFilter}: ${c.label}`}
          className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-sm transition-colors hover:bg-border"
        >
          {c.label}
          <X className="size-3.5" />
        </LocaleLink>
      ))}
      {chips.length > 1 && (
        <LocaleLink
          href={basePath}
          scroll={false}
          className="px-2 text-sm font-medium text-primary hover:underline"
        >
          {dict.listing.clearAll}
        </LocaleLink>
      )}
    </div>
  );
}
