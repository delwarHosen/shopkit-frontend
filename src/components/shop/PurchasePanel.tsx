"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Minus, Plus, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDictionary, useLocale } from "@/i18n/I18nProvider";
import { fill, localizePath, productLabel } from "@/i18n/i18n-utils";
import { LocaleLink } from "@/i18n/LocaleLink";
import { formatNumber, formatPrice } from "@/lib/format";
import {
  COLOR_OPTION,
  optionName,
  optionValue,
  SWATCHES,
} from "@/lib/product-options";
import { useAppDispatch } from "@/store/hooks";
import { addItem } from "@/store/slices/cartSlice";
import type { Product } from "@/types/shop";

export function PurchasePanel({ product }: { product: Product }) {
  const dict = useDictionary();
  const locale = useLocale();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [selected, setSelected] = useState<Record<string, string>>({});
  const [qty, setQty] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const [pastCta, setPastCta] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  const soldOut = product.stock <= 0;
  const maxQty = Math.max(1, Math.min(product.stock, 10));
  const missing = product.options.find((o) => !selected[o.name]);
  const name = productLabel(dict, product);

  // মূল বাটন স্ক্রিনের ওপরে চলে গেলে মোবাইলে নিচে স্টিকি বার দেখাবে
  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) =>
      setPastCta(!e.isIntersecting && e.boundingClientRect.top < 0),
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 2500);
    return () => clearTimeout(t);
  }, [added]);

  function addToCart(): boolean {
    if (missing) {
      setError(
        fill(dict.detail.selectOption, {
          name: optionName(dict, missing.name),
        }),
      );
      optionsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return false;
    }
    const variant =
      product.options.map((o) => selected[o.name]).join(" / ") || undefined;
    dispatch(
      addItem({
        id: variant ? `${product.id}:${variant}` : product.id,
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: product.images[0],
        price: product.price,
        variant,
        quantity: qty,
      }),
    );
    setError(null);
    setAdded(true);
    return true;
  }

  function buyNow() {
    if (addToCart()) router.push(localizePath(locale, "/checkout"));
  }

  const primaryBtn =
    "inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full font-semibold transition-opacity disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div>
      {product.options.length > 0 && (
        <div ref={optionsRef} className="space-y-5">
          {product.options.map((o) => {
            const isColor = o.name === COLOR_OPTION;
            const chosen = selected[o.name];
            return (
              <fieldset key={o.name}>
                <legend className="mb-2 text-sm font-semibold">
                  {optionName(dict, o.name)}
                  {chosen && (
                    <span className="ms-2 font-normal text-muted-foreground">
                      {optionValue(dict, chosen)}
                    </span>
                  )}
                </legend>
                <div role="radiogroup" className="flex flex-wrap gap-2">
                  {o.values.map((v) => {
                    const active = chosen === v;
                    const pick = () => {
                      setSelected((s) => ({ ...s, [o.name]: v }));
                      setError(null);
                    };
                    return isColor ? (
                      <button
                        key={v}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        aria-label={optionValue(dict, v)}
                        title={optionValue(dict, v)}
                        onClick={pick}
                        className={`size-10 rounded-full border-2 p-0.5 transition-colors ${active ? "border-primary" : "border-border hover:border-foreground/40"}`}
                      >
                        <span
                          className="block size-full rounded-full border border-black/10"
                          style={{ background: SWATCHES[v] ?? "#cccccc" }}
                        />
                      </button>
                    ) : (
                      <button
                        key={v}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={pick}
                        className={`h-11 min-w-12 rounded-lg border px-4 text-sm font-medium transition-colors ${
                          active
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-foreground/40"
                        }`}
                      >
                        {optionValue(dict, v)}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            );
          })}
          {error && (
            <p role="alert" className="text-sm font-medium text-rose-600">
              {error}
            </p>
          )}
        </div>
      )}

      {soldOut ? (
        <p className="mt-6 rounded-(--radius) bg-muted p-4 text-sm text-muted-foreground">
          {dict.detail.soldOutNote}
        </p>
      ) : (
        <>
          <div className="mt-6 flex items-center gap-3">
            <span className="text-sm font-semibold">
              {dict.detail.quantity}
            </span>
            <div className="flex items-center rounded-full border border-border">
              <button
                type="button"
                aria-label={dict.detail.decrease}
                disabled={qty <= 1}
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="grid size-10 place-items-center rounded-full hover:bg-muted disabled:opacity-40"
              >
                <Minus className="size-4" />
              </button>
              <span
                className="min-w-8 text-center text-sm font-semibold"
                aria-live="polite"
              >
                {formatNumber(qty, locale)}
              </span>
              <button
                type="button"
                aria-label={dict.detail.increase}
                disabled={qty >= maxQty}
                onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                className="grid size-10 place-items-center rounded-full hover:bg-muted disabled:opacity-40"
              >
                <Plus className="size-4" />
              </button>
            </div>
          </div>

          <div ref={ctaRef} className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={addToCart}
              className={`${primaryBtn} border-2 border-primary text-primary hover:bg-primary/5`}
            >
              {added ? (
                <Check className="size-5" />
              ) : (
                <ShoppingBag className="size-5" />
              )}
              {added ? dict.product.added : dict.product.addToCart}
            </button>
            <button
              type="button"
              onClick={buyNow}
              className={`${primaryBtn} bg-primary text-primary-foreground hover:opacity-90`}
            >
              {dict.detail.buyNow}
            </button>
          </div>

          {added && (
            <p className="mt-3 text-sm">
              <LocaleLink
                href="/cart"
                className="font-medium text-primary hover:underline"
              >
                {dict.detail.viewCart} →
              </LocaleLink>
            </p>
          )}
        </>
      )}

      {/* মোবাইলে স্টিকি বার */}
      <AnimatePresence>
        {pastCta && !soldOut && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-30 flex items-center gap-3 border-t border-border bg-background/95 px-4 py-3 backdrop-blur md:hidden"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs text-muted-foreground">{name}</p>
              <p className="font-bold">{formatPrice(product.price, locale)}</p>
            </div>
            <button
              type="button"
              onClick={addToCart}
              className="h-11 shrink-0 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground"
            >
              {added ? dict.product.added : dict.product.addToCart}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
