import { SearchX } from "lucide-react";
import { Suspense } from "react";
import { containerCls } from "@/components/layout/styles";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/bn";
import { fill } from "@/i18n/i18n-utils";
import { LocaleLink } from "@/i18n/LocaleLink";
import { formatNumber } from "@/lib/format";
import {
  parseListing,
  serialize,
  toFilters,
  type RawSearchParams,
} from "@/lib/product-query";
import { getCategories, getFilterMeta, getProducts } from "@/lib/services";
import type { ProductFilters } from "@/types/shop";
import { ActiveFilters } from "./ActiveFilters";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";
import { FilterPanel, type PanelProps } from "./FilterPanel";
import { ListingGridSkeleton } from "./ListingSkeleton";
import { MobileFilters } from "./MobileFilters";
import { Pagination } from "./Pagination";
import { ProductCard } from "./ProductCard";
import { SortSelect } from "./SortSelect";

type Props = {
  locale: Locale;
  dict: Dictionary;
  basePath: string; // ভাষা ছাড়া, যেমন "/products"
  searchParams: RawSearchParams;
  title: string;
  subtitle?: string;
  crumbs: Crumb[];
  /** পেজ নিজে যা ঠিক করে দেয়: ক্যাটাগরি পেজে { category }, অফার পেজে { onSale: true } */
  fixed?: Partial<ProductFilters>;
};

export async function ProductListing({
  locale,
  dict,
  basePath,
  searchParams,
  title,
  subtitle,
  crumbs,
  fixed = {},
}: Props) {
  const state = parseListing(searchParams);
  const current = serialize(state);
  const [categories, meta] = await Promise.all([
    getCategories(),
    getFilterMeta(),
  ]);

  const showCategory = !fixed.category;
  const showSale = !fixed.onSale;
  const heading = state.q
    ? fill(dict.listing.resultsFor, { q: state.q })
    : title;

  const panel: PanelProps = {
    basePath,
    current,
    state,
    categories,
    meta,
    showCategory,
    showSale,
  };
  const activeCount =
    (state.q ? 1 : 0) +
    (showCategory && state.category ? 1 : 0) +
    (state.min != null || state.max != null ? 1 : 0) +
    (state.inStock ? 1 : 0) +
    (showSale && state.sale ? 1 : 0);

  return (
    <div className={`${containerCls} py-6 sm:py-10`}>
      <Breadcrumbs items={crumbs} locale={locale} />
      <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
        {heading}
      </h1>
      {subtitle && !state.q && (
        <p className="mt-1 text-muted-foreground">{subtitle}</p>
      )}

      <ActiveFilters
        {...{
          basePath,
          current,
          state,
          categories,
          dict,
          locale,
          showCategory,
          showSale,
        }}
      />

      <div className="mt-6 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="hidden self-start lg:sticky lg:top-24 lg:block">
          <FilterPanel {...panel} />
        </aside>

        <div className="min-w-0">
          {/* টুলবার Suspense এর বাইরে, তাই ফিল্টার বদলালেও মোবাইল শিট বন্ধ হয় না */}
          <div className="mb-5 flex items-center gap-3">
            <MobileFilters {...panel} activeCount={activeCount} />
            <SortSelect
              basePath={basePath}
              current={current}
              value={state.sort}
            />
          </div>

          <Suspense
            key={JSON.stringify(current)}
            fallback={<ListingGridSkeleton />}
          >
            <ListingResults
              {...{ locale, dict, basePath, current, state, fixed }}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

async function ListingResults({
  locale,
  dict,
  basePath,
  current,
  state,
  fixed,
}: {
  locale: Locale;
  dict: Dictionary;
  basePath: string;
  current: Record<string, string>;
  state: ReturnType<typeof parseListing>;
  fixed: Partial<ProductFilters>;
}) {
  const result = await getProducts(toFilters(state, fixed));

  if (result.total === 0) {
    return (
      <div className="grid place-items-center rounded-(--radius) border border-dashed border-border px-6 py-20 text-center">
        <SearchX className="size-10 text-muted-foreground" />
        <h2 className="mt-4 text-lg font-semibold">{dict.listing.noResults}</h2>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          {dict.listing.noResultsText}
        </p>
        <LocaleLink
          href={basePath}
          className="mt-6 inline-flex h-11 items-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground"
        >
          {dict.listing.clearAll}
        </LocaleLink>
      </div>
    );
  }

  return (
    <>
      <p className="mb-5 text-sm text-muted-foreground">
        {fill(dict.listing.results, { n: formatNumber(result.total, locale) })}
      </p>
      <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-5 xl:grid-cols-4">
        {result.items.map((p, i) => (
          <ProductCard key={p.id} product={p} priority={i < 4} />
        ))}
      </div>
      <Pagination
        page={result.page}
        totalPages={result.totalPages}
        basePath={basePath}
        current={current}
        dict={dict}
        locale={locale}
      />
    </>
  );
}
