"use client";

import { Check, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDictionary, useLocale } from "@/i18n/I18nProvider";
import { fill, productLabel } from "@/i18n/i18n-utils";
import { LocaleLink } from "@/i18n/LocaleLink";
import { discountPercent, formatNumber, formatPrice } from "@/lib/format";
import { brandLabel } from "@/lib/product-options";
import { useAppDispatch } from "@/store/hooks";
import { addItem } from "@/store/slices/cartSlice";
import type { Product } from "@/types/shop";
import { Stars } from "./Stars";

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const dict = useDictionary();
  const locale = useLocale();
  const dispatch = useAppDispatch();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 1600);
    return () => clearTimeout(t);
  }, [added]);

  const name = productLabel(dict, product);
  const discount = discountPercent(product.price, product.comparePrice);
  const soldOut = product.stock <= 0;
  const hasOptions = product.options.length > 0;
  const lowStock = !soldOut && product.stock <= 5;
  const href = `/products/${product.slug}`;

  const badge = "rounded-full px-2 py-0.5 text-[11px] font-semibold";
  const roundBtn =
    "absolute bottom-2 end-2 grid size-10 place-items-center rounded-full bg-background text-foreground shadow-md transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-primary";

  return (
    <article className="group flex flex-col">
      <div className="relative overflow-hidden rounded-(--radius) bg-muted">
        <LocaleLink
          href={href}
          className="relative block aspect-4/5"
          aria-label={name}
        >
          <Image
            src={product.images[0]}
            alt={name}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className={`object-cover transition-transform duration-500 group-hover:scale-105 ${soldOut ? "opacity-60" : ""}`}
          />
          {product.images[1] && (
            <Image
              src={product.images[1]}
              alt=""
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          )}
        </LocaleLink>

        <div className="pointer-events-none absolute start-2 top-2 flex flex-col items-start gap-1">
          {discount > 0 && (
            <span className={`${badge} bg-rose-600 text-white`}>
              -{formatNumber(discount, locale)}%
            </span>
          )}
          {product.isNew && (
            <span className={`${badge} bg-primary text-primary-foreground`}>
              {dict.product.new}
            </span>
          )}
          {soldOut && (
            <span className={`${badge} bg-foreground text-background`}>
              {dict.product.soldOut}
            </span>
          )}
        </div>

        {!soldOut &&
          (hasOptions ? (
            <LocaleLink
              href={href}
              className={roundBtn}
              aria-label={`${dict.product.chooseOptions}: ${name}`}
            >
              <ShoppingBag className="size-[18px]" />
            </LocaleLink>
          ) : (
            <button
              type="button"
              className={roundBtn}
              aria-label={`${dict.product.addToCart}: ${name}`}
              onClick={() => {
                dispatch(
                  addItem({
                    id: product.id,
                    productId: product.id,
                    slug: product.slug,
                    name: product.name,
                    image: product.images[0],
                    price: product.price,
                  }),
                );
                setAdded(true);
              }}
            >
              {added ? (
                <Check className="size-[18px] text-primary" />
              ) : (
                <ShoppingBag className="size-[18px]" />
              )}
            </button>
          ))}
      </div>

      <div className="mt-3 flex flex-1 flex-col gap-1">
        <p className="text-xs text-muted-foreground">
          {brandLabel(dict, product.brand)}
        </p>
        <h3 className="line-clamp-2 text-sm font-medium leading-snug">
          <LocaleLink href={href} className="hover:text-primary">
            {name}
          </LocaleLink>
        </h3>
        <Stars rating={product.rating} count={product.reviewCount} />
        <div className="mt-auto flex items-baseline gap-2 pt-1">
          <span className="font-bold">
            {formatPrice(product.price, locale)}
          </span>
          {product.comparePrice && product.comparePrice > product.price && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.comparePrice, locale)}
            </span>
          )}
        </div>
        {lowStock && (
          <p className="text-xs font-medium text-orange-600 dark:text-orange-400">
            {fill(dict.product.lowStock, {
              n: formatNumber(product.stock, locale),
            })}
          </p>
        )}
      </div>
    </article>
  );
}
