"use client";

import { ShoppingBag, Truck } from "lucide-react";
import { clientConfig } from "@/config/client";
import { useDictionary, useLocale } from "@/i18n/I18nProvider";
import { fill } from "@/i18n/i18n-utils";
import { LocaleLink } from "@/i18n/LocaleLink";
import { formatNumber, formatPrice } from "@/lib/format";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearCart,
  selectCartCount,
  selectCartItems,
  selectCartSubtotal,
} from "@/store/slices/cartSlice";
import { CartItemRow } from "./CartItemRow";

export function CartView() {
  const dict = useDictionary();
  const locale = useLocale();
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const count = useAppSelector(selectCartCount);
  const subtotal = useAppSelector(selectCartSubtotal);
  const hydrated = useAppSelector((s) => s.cart.hydrated);

  // localStorage থেকে কার্ট লোড হওয়া পর্যন্ত স্কেলিটন (খালি কার্টের ঝলক এড়াতে)
  if (!hydrated) {
    return (
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]" aria-busy>
        <div className="space-y-4">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-(--radius) bg-muted"
            />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-(--radius) bg-muted" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mt-10 grid place-items-center rounded-(--radius) border border-dashed border-border px-6 py-20 text-center">
        <span className="grid size-16 place-items-center rounded-full bg-muted">
          <ShoppingBag className="size-8 text-muted-foreground" />
        </span>
        <h2 className="mt-5 text-xl font-semibold">{dict.cart.empty}</h2>
        <p className="mt-1 text-muted-foreground">{dict.cart.emptyText}</p>
        <LocaleLink
          href="/products"
          className="mt-6 inline-flex h-12 items-center rounded-full bg-primary px-7 font-semibold text-primary-foreground"
        >
          {dict.cart.continue}
        </LocaleLink>
      </div>
    );
  }

  const { freeOver } = clientConfig.shipping;
  const remaining = freeOver - subtotal;
  const progress =
    freeOver > 0 ? Math.min(100, (subtotal / freeOver) * 100) : 0;

  return (
    <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_380px]">
      <section>
        <div className="flex items-center justify-between border-b border-border pb-3">
          <p className="text-sm text-muted-foreground">
            {fill(dict.cart.items, { n: formatNumber(count, locale) })}
          </p>
          <button
            type="button"
            onClick={() => dispatch(clearCart())}
            className="text-sm text-muted-foreground hover:text-rose-600"
          >
            {dict.cart.clear}
          </button>
        </div>
        <ul className="divide-y divide-border">
          {items.map((item) => (
            <CartItemRow key={item.id} item={item} />
          ))}
        </ul>
      </section>

      <aside className="rounded-(--radius) border border-border p-5 lg:sticky lg:top-24">
        <h2 className="text-lg font-semibold">{dict.cart.summary}</h2>

        {freeOver > 0 && (
          <div className="mt-4 rounded-lg bg-muted p-3">
            <p className="flex items-center gap-2 text-sm">
              <Truck className="size-4 shrink-0 text-primary" />
              {remaining > 0
                ? fill(dict.cart.freeShippingLeft, {
                    amount: formatPrice(remaining, locale),
                  })
                : dict.cart.freeShippingDone}
            </p>
            <div
              className="mt-2 h-1.5 overflow-hidden rounded-full bg-border"
              role="progressbar"
              aria-valuenow={Math.round(progress)}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">{dict.cart.subtotal}</dt>
            <dd className="font-medium">{formatPrice(subtotal, locale)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">{dict.cart.shipping}</dt>
            <dd className="text-muted-foreground">
              {remaining <= 0 && freeOver > 0
                ? dict.checkout.free
                : dict.cart.shippingAtCheckout}
            </dd>
          </div>
        </dl>

        <LocaleLink
          href="/checkout"
          className="mt-6 flex h-12 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          {dict.cart.checkout}
        </LocaleLink>
        <LocaleLink
          href="/products"
          className="mt-3 block text-center text-sm text-muted-foreground hover:text-foreground"
        >
          {dict.cart.continue}
        </LocaleLink>
      </aside>
    </div>
  );
}
