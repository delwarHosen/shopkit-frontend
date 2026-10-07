"use client";

import { motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { clientConfig } from "@/config/client";
import { DIVISIONS, placeLabel } from "@/data/locations";
import { useDictionary, useLocale } from "@/i18n/I18nProvider";
import { fill } from "@/i18n/i18n-utils";
import { LocaleLink } from "@/i18n/LocaleLink";
import { formatPrice } from "@/lib/format";
import { loadLastOrder } from "@/lib/last-order";
import type { Order } from "@/types/shop";
import { OrderSummary } from "./OrderSummary";

export function OrderSuccess() {
  const dict = useDictionary();
  const locale = useLocale();
  const t = dict.success;
  const [order, setOrder] = useState<Order | null | undefined>(undefined); // undefined = লোড হচ্ছে
  const [copied, setCopied] = useState(false);

  useEffect(() => setOrder(loadLastOrder()), []);

  if (order === undefined)
    return (
      <div
        className="mt-8 h-72 animate-pulse rounded-(--radius) bg-muted"
        aria-busy
      />
    );

  if (order === null) {
    return (
      <div className="mt-10 rounded-(--radius) border border-dashed border-border px-6 py-16 text-center">
        <p className="text-lg font-semibold">{t.noOrder}</p>
        <LocaleLink
          href="/products"
          className="mt-6 inline-flex h-12 items-center rounded-full bg-primary px-7 font-semibold text-primary-foreground"
        >
          {t.continue}
        </LocaleLink>
      </div>
    );
  }

  const division = DIVISIONS.find((d) => d.key === order.address.division);
  const district = division?.districts.find(
    (d) => d.key === order.address.district,
  );
  const placeText = [
    order.address.line,
    order.address.thana,
    district ? placeLabel(district, locale) : order.address.district,
    division ? placeLabel(division, locale) : order.address.division,
  ].join(", ");
  const needsVerify =
    order.paymentMethod === "bkash" || order.paymentMethod === "nagad";

  return (
    <div className="mx-auto mt-8 max-w-4xl">
      <div className="text-center">
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className="mx-auto grid size-20 place-items-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
        >
          <Check className="size-10" strokeWidth={3} />
        </motion.span>
        <h1 className="mt-5 text-2xl font-bold sm:text-3xl">{t.title}</h1>
        <p className="mt-2 text-muted-foreground">
          {fill(t.thanks, { name: order.customerName })}
        </p>

        <div className="mx-auto mt-6 inline-flex flex-col items-center rounded-(--radius) border border-border px-8 py-4">
          <span className="text-sm text-muted-foreground">{t.orderNumber}</span>
          <span
            className="mt-1 flex items-center gap-2 text-2xl font-bold tracking-wide"
            dir="ltr"
          >
            {order.orderNumber}
            <button
              type="button"
              aria-label={t.copy}
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(order.orderNumber);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1800);
                } catch {}
              }}
              className="grid size-8 place-items-center rounded-md border border-border text-muted-foreground hover:text-foreground"
            >
              {copied ? (
                <Check className="size-4 text-primary" />
              ) : (
                <Copy className="size-4" />
              )}
            </button>
          </span>
        </div>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
          {t.keepNumber}
        </p>
        {needsVerify && (
          <p className="mx-auto mt-3 max-w-md rounded-lg bg-amber-500/10 px-4 py-2 text-sm text-amber-700 dark:text-amber-400">
            {t.paymentPending}
          </p>
        )}
      </div>

      <div className="mt-10 grid items-start gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <section className="rounded-(--radius) border border-border p-5">
            <h2 className="font-semibold">{t.deliverTo}</h2>
            <p className="mt-2 text-sm font-medium">
              {order.customerName} · <span dir="ltr">{order.phone}</span>
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{placeText}</p>
            <p className="mt-4 text-sm">
              <span className="text-muted-foreground">{t.paymentMethod}: </span>
              <span className="font-medium">
                {dict.footer.methods[order.paymentMethod]}
              </span>
            </p>
          </section>

          <section className="rounded-(--radius) border border-border p-5">
            <h2 className="font-semibold">{t.next}</h2>
            <ol className="mt-3 space-y-3 text-sm">
              {[t.stepConfirm, t.stepPack, t.stepDeliver].map((s, i) => (
                <li key={s} className="flex items-start gap-3">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{s}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <OrderSummary
          items={order.items.map((i) => ({
            id: `${i.productId}:${i.variant ?? ""}`,
            productId: i.productId,
            slug: slugFromId(i.productId),
            name: i.name,
            image: i.image,
            price: i.price,
            variant: i.variant,
            quantity: i.quantity,
          }))}
          subtotal={order.subtotal}
          shipping={order.shipping}
          discount={order.discount}
          total={order.total}
        />
      </div>

      <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
        <LocaleLink
          href={`/track-order?order=${order.orderNumber}`}
          className="inline-flex h-12 items-center justify-center rounded-full border-2 border-primary px-7 font-semibold text-primary hover:bg-primary/5"
        >
          {t.trackOrder}
        </LocaleLink>
        <LocaleLink
          href="/products"
          className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-7 font-semibold text-primary-foreground hover:opacity-90"
        >
          {t.continue}
        </LocaleLink>
      </div>
      <p className="sr-only">
        {clientConfig.name[locale]} {formatPrice(order.total, locale)}
      </p>
    </div>
  );
}

// OrderItem এ slug নেই, productId ("p-<slug>") থেকে বের করা হয় (ডেমো ডেটার নিয়ম)
function slugFromId(productId: string) {
  return productId.replace(/^p-/, "");
}
