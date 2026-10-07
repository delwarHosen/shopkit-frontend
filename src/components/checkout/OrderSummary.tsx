"use client";

import Image from "next/image";
import { useDictionary, useLocale } from "@/i18n/I18nProvider";
import { productLabel } from "@/i18n/i18n-utils";
import { formatNumber, formatPrice } from "@/lib/format";
import { optionValue } from "@/lib/product-options";
import type { CartItem } from "@/store/slices/cartSlice";

type Props = {
  items: CartItem[];
  subtotal: number;
  shipping: number | null; // null = ঠিকানা এখনো দেওয়া হয়নি
  discount: number;
  total: number;
  children?: React.ReactNode; // কুপন ও বাটন
};

export function OrderSummary({
  items,
  subtotal,
  shipping,
  discount,
  total,
  children,
}: Props) {
  const dict = useDictionary();
  const locale = useLocale();

  return (
    <div className="rounded-(--radius) border border-border p-5">
      <h2 className="text-lg font-semibold">{dict.checkout.summary}</h2>

      <ul className="mt-4 max-h-72 space-y-4 overflow-y-auto pe-1">
        {items.map((it) => {
          const variant = it.variant
            ?.split(" / ")
            .map((v) => optionValue(dict, v))
            .join(" / ");
          return (
            <li key={it.id} className="flex items-center gap-3">
              <span className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                <Image
                  src={it.image}
                  alt=""
                  fill
                  sizes="56px"
                  className="object-cover"
                />
                <span className="absolute -end-0 -top-0 grid min-w-5 place-items-center rounded-es-lg bg-foreground px-1 text-[11px] font-semibold leading-5 text-background">
                  {formatNumber(it.quantity, locale)}
                </span>
              </span>
              <span className="min-w-0 flex-1">
                <span className="line-clamp-1 block text-sm font-medium">
                  {productLabel(dict, it)}
                </span>
                {variant && (
                  <span className="block text-xs text-muted-foreground">
                    {variant}
                  </span>
                )}
              </span>
              <span className="text-sm font-medium">
                {formatPrice(it.price * it.quantity, locale)}
              </span>
            </li>
          );
        })}
      </ul>

      {children}

      <dl className="mt-5 space-y-3 border-t border-border pt-5 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">{dict.checkout.subtotal}</dt>
          <dd className="font-medium">{formatPrice(subtotal, locale)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">{dict.checkout.shipping}</dt>
          <dd
            className={
              shipping === 0
                ? "font-medium text-emerald-600 dark:text-emerald-400"
                : shipping == null
                  ? "text-muted-foreground"
                  : "font-medium"
            }
          >
            {shipping == null
              ? dict.checkout.shippingPending
              : shipping === 0
                ? dict.checkout.free
                : formatPrice(shipping, locale)}
          </dd>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
            <dt>{dict.checkout.discount}</dt>
            <dd className="font-medium">-{formatPrice(discount, locale)}</dd>
          </div>
        )}
        <div className="flex justify-between border-t border-border pt-3 text-base">
          <dt className="font-semibold">{dict.checkout.total}</dt>
          <dd className="text-xl font-bold">{formatPrice(total, locale)}</dd>
        </div>
      </dl>
    </div>
  );
}
