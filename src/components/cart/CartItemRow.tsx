"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useDictionary, useLocale } from "@/i18n/I18nProvider";
import { productLabel } from "@/i18n/i18n-utils";
import { LocaleLink } from "@/i18n/LocaleLink";
import { formatNumber, formatPrice } from "@/lib/format";
import { optionValue } from "@/lib/product-options";
import { useAppDispatch } from "@/store/hooks";
import {
  removeItem,
  setQuantity,
  type CartItem,
} from "@/store/slices/cartSlice";

const MAX_QTY = 10;

export function CartItemRow({ item }: { item: CartItem }) {
  const dict = useDictionary();
  const locale = useLocale();
  const dispatch = useAppDispatch();

  const name = productLabel(dict, item);
  // "L / কালো" কে বর্তমান ভাষায় দেখায়
  const variant = item.variant
    ?.split(" / ")
    .map((v) => optionValue(dict, v))
    .join(" / ");
  const href = `/products/${item.slug}`;

  return (
    <li className="flex gap-4 py-5">
      <LocaleLink
        href={href}
        className="relative size-24 shrink-0 overflow-hidden rounded-(--radius) bg-muted sm:size-28"
      >
        <Image
          src={item.image}
          alt={name}
          fill
          sizes="112px"
          className="object-cover"
        />
      </LocaleLink>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="line-clamp-2 text-sm font-medium sm:text-base">
              <LocaleLink href={href} className="hover:text-primary">
                {name}
              </LocaleLink>
            </h3>
            {variant && (
              <p className="mt-0.5 text-sm text-muted-foreground">{variant}</p>
            )}
            <p className="mt-1 text-sm text-muted-foreground">
              {formatPrice(item.price, locale)} {dict.cart.each}
            </p>
          </div>
          <button
            type="button"
            onClick={() => dispatch(removeItem(item.id))}
            aria-label={`${dict.cart.remove}: ${name}`}
            className="grid size-9 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-rose-600"
          >
            <Trash2 className="size-[18px]" />
          </button>
        </div>

        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex items-center rounded-full border border-border">
            <button
              type="button"
              aria-label={dict.detail.decrease}
              onClick={() =>
                dispatch(
                  setQuantity({ id: item.id, quantity: item.quantity - 1 }),
                )
              }
              className="grid size-9 place-items-center rounded-full hover:bg-muted"
            >
              <Minus className="size-4" />
            </button>
            <span
              className="min-w-8 text-center text-sm font-semibold"
              aria-live="polite"
            >
              {formatNumber(item.quantity, locale)}
            </span>
            <button
              type="button"
              aria-label={dict.detail.increase}
              disabled={item.quantity >= MAX_QTY}
              onClick={() =>
                dispatch(
                  setQuantity({ id: item.id, quantity: item.quantity + 1 }),
                )
              }
              className="grid size-9 place-items-center rounded-full hover:bg-muted disabled:opacity-40"
            >
              <Plus className="size-4" />
            </button>
          </div>
          <p className="font-bold">
            {formatPrice(item.price * item.quantity, locale)}
          </p>
        </div>
      </div>
    </li>
  );
}
