"use client";

import { Heart } from "lucide-react";
import { ListingGridSkeleton } from "@/components/shop/ListingSkeleton";
import { ProductCard } from "@/components/shop/ProductCard";
import { useDictionary, useLocale } from "@/i18n/I18nProvider";
import { fill } from "@/i18n/i18n-utils";
import { LocaleLink } from "@/i18n/LocaleLink";
import { formatNumber } from "@/lib/format";
import { useGetProductsByIdsQuery } from "@/store/api/hooks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearWishlist, selectWishlistIds } from "@/store/slices/wishlistSlice";

export function WishlistView() {
  const dict = useDictionary();
  const locale = useLocale();
  const dispatch = useAppDispatch();
  const ids = useAppSelector(selectWishlistIds);
  const hydrated = useAppSelector((s) => s.wishlist.hydrated);
  const { data, isLoading } = useGetProductsByIdsQuery(ids, {
    skip: ids.length === 0,
  });
  const t = dict.wishlist;

  if (!hydrated || (ids.length > 0 && isLoading)) {
    return (
      <div className="mt-8">
        <ListingGridSkeleton count={Math.max(ids.length, 4)} />
      </div>
    );
  }

  if (ids.length === 0) {
    return (
      <div className="mt-10 grid place-items-center rounded-(--radius) border border-dashed border-border px-6 py-20 text-center">
        <span className="grid size-16 place-items-center rounded-full bg-muted">
          <Heart className="size-8 text-muted-foreground" />
        </span>
        <h2 className="mt-5 text-xl font-semibold">{t.empty}</h2>
        <p className="mt-1 text-muted-foreground">{t.emptyText}</p>
        <LocaleLink
          href="/products"
          className="mt-6 inline-flex h-12 items-center rounded-full bg-primary px-7 font-semibold text-primary-foreground"
        >
          {dict.cart.continue}
        </LocaleLink>
      </div>
    );
  }

  // উইশলিস্টে যোগ করার ক্রম অনুযায়ী সাজানো (সর্বশেষ আগে)
  const items = ids
    .map((id) => data?.find((p) => p.id === id))
    .filter((p) => p != null);

  return (
    <div className="mt-6">
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {fill(t.count, { n: formatNumber(ids.length, locale) })}
        </p>
        <button
          type="button"
          onClick={() => dispatch(clearWishlist())}
          className="text-sm text-muted-foreground hover:text-rose-600"
        >
          {t.clear}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
