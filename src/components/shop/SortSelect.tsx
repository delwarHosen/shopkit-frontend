"use client";

import { ChevronDown } from "lucide-react";
import { useDictionary } from "@/i18n/I18nProvider";
import { SORTS } from "@/lib/product-query";
import type { ProductSort } from "@/types/shop";
import { useListingNav } from "./useListingNav";

export function SortSelect({
  basePath,
  current,
  value,
}: {
  basePath: string;
  current: Record<string, string>;
  value: ProductSort;
}) {
  const dict = useDictionary();
  const { navigate, pending } = useListingNav(basePath, current);

  return (
    <label className="ms-auto flex items-center gap-2 text-sm">
      <span className="hidden text-muted-foreground sm:inline">
        {dict.listing.sortBy}
      </span>
      <span className="relative">
        <select
          value={value}
          aria-busy={pending}
          onChange={(e) => navigate({ sort: e.target.value })}
          className="h-10 appearance-none rounded-full border border-border bg-background ps-4 pe-9 text-sm font-medium outline-none focus:border-primary"
        >
          {SORTS.map((s) => (
            <option key={s} value={s}>
              {dict.listing.sort[s]}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      </span>
    </label>
  );
}
