"use client";

import type { FormEvent } from "react";
import { useDictionary, useLocale } from "@/i18n/I18nProvider";
import { categoryLabel } from "@/i18n/i18n-utils";
import { fill } from "@/i18n/i18n-utils";
import { LocaleLink } from "@/i18n/LocaleLink";
import { formatNumber, formatPrice } from "@/lib/format";
import { buildHref, toNumber, type ListingState } from "@/lib/product-query";
import type { CategoryWithCount, FilterMeta } from "@/types/shop";
import { useListingNav } from "./useListingNav";

export type PanelProps = {
  basePath: string;
  current: Record<string, string>;
  state: ListingState;
  categories: CategoryWithCount[];
  meta: FilterMeta;
  showCategory: boolean;
  showSale: boolean;
};

const PRESETS = [1000, 2000, 3000];

export function FilterPanel({
  basePath,
  current,
  state,
  categories,
  meta,
  showCategory,
  showSale,
}: PanelProps) {
  const dict = useDictionary();
  const locale = useLocale();
  const { navigate, pending } = useListingNav(basePath, current);

  const group = "border-b border-border py-5 first:pt-0 last:border-b-0";
  const title = "mb-3 text-sm font-semibold";
  const input =
    "h-10 w-full min-w-0 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary";

  function applyPrice(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    let min = toNumber(fd.get("min") as string);
    let max = toNumber(fd.get("max") as string);
    if (min != null && max != null && min > max) [min, max] = [max, min];
    navigate({ min, max });
  }

  return (
    <div
      aria-busy={pending}
      className={
        pending ? "opacity-60 transition-opacity" : "transition-opacity"
      }
    >
      {showCategory && (
        <section className={group}>
          <h3 className={title}>{dict.listing.category}</h3>
          <ul className="space-y-1">
            {[
              {
                slug: undefined,
                label: dict.listing.allProducts,
                count: undefined,
              },
              ...categories.map((c) => ({
                slug: c.slug as string | undefined,
                label: categoryLabel(dict, c),
                count: c.productCount,
              })),
            ].map((c) => {
              const active = state.category === c.slug;
              return (
                <li key={c.slug ?? "all"}>
                  <LocaleLink
                    href={buildHref(basePath, current, { category: c.slug })}
                    scroll={false}
                    aria-current={active ? "true" : undefined}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted ${
                      active ? "bg-primary/10 font-semibold text-primary" : ""
                    }`}
                  >
                    <span>{c.label}</span>
                    {c.count != null && (
                      <span className="text-xs text-muted-foreground">
                        {formatNumber(c.count, locale)}
                      </span>
                    )}
                  </LocaleLink>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section className={group}>
        <h3 className={title}>{dict.listing.price}</h3>
        <form
          key={`${state.min}-${state.max}`}
          onSubmit={applyPrice}
          className="flex items-center gap-2"
        >
          <input
            name="min"
            inputMode="numeric"
            defaultValue={state.min ?? ""}
            placeholder={formatNumber(meta.minPrice, locale)}
            aria-label={dict.listing.min}
            className={input}
          />
          <span className="text-muted-foreground">–</span>
          <input
            name="max"
            inputMode="numeric"
            defaultValue={state.max ?? ""}
            placeholder={formatNumber(meta.maxPrice, locale)}
            aria-label={dict.listing.max}
            className={input}
          />
          <button
            type="submit"
            className="h-10 shrink-0 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground"
          >
            {dict.listing.apply}
          </button>
        </form>
        <div className="mt-3 flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => navigate({ min: undefined, max: p })}
              className={`rounded-full border px-3 py-1 text-xs transition-colors hover:border-primary ${
                state.max === p && state.min == null
                  ? "border-primary text-primary"
                  : "border-border"
              }`}
            >
              {fill(dict.listing.priceUnder, { price: formatPrice(p, locale) })}
            </button>
          ))}
        </div>
      </section>

      <section className={group}>
        <h3 className={title}>{dict.listing.availability}</h3>
        <div className="space-y-3">
          <label className="flex cursor-pointer items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={state.inStock}
              onChange={(e) => navigate({ inStock: e.target.checked })}
              className="size-4 accent-primary"
            />
            {dict.listing.inStockOnly}
          </label>
          {showSale && (
            <label className="flex cursor-pointer items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={state.sale}
                onChange={(e) => navigate({ sale: e.target.checked })}
                className="size-4 accent-primary"
              />
              {dict.listing.onSaleOnly}
            </label>
          )}
        </div>
      </section>
    </div>
  );
}
