"use client";

import { Loader2, Search } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Field, inputCls } from "@/components/checkout/Field";
import { orders as seedOrders } from "@/data/orders";
import { DIVISIONS, placeLabel } from "@/data/locations";
import { useDictionary, useLocale } from "@/i18n/I18nProvider";
import { productLabel } from "@/i18n/i18n-utils";
import { formatDate, formatPrice } from "@/lib/format";
import { loadLastOrder } from "@/lib/last-order";
import { optionValue } from "@/lib/product-options";
import { isValidPhone, normalizePhone } from "@/lib/validators";
import { useLazyTrackOrderQuery } from "@/store/api/hooks";
import type { Order } from "@/types/shop";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { OrderTimeline } from "./OrderTimeline";

export function TrackOrder() {
  const dict = useDictionary();
  const locale = useLocale();
  const params = useSearchParams();
  const t = dict.track;

  const [number, setNumber] = useState(params.get("order") ?? "");
  const [phone, setPhone] = useState(params.get("phone") ?? "");
  const [errors, setErrors] = useState<{ number?: string; phone?: string }>({});
  const [result, setResult] = useState<Order | null | undefined>(undefined); // undefined = এখনো খোঁজা হয়নি
  const [trigger, { isFetching }] = useLazyTrackOrderQuery();
  const auto = useRef(false);

  async function search(num: string, ph: string) {
    const errs: typeof errors = {};
    if (!num.trim()) errs.number = dict.checkout.errors.required;
    if (!isValidPhone(ph)) errs.phone = dict.checkout.errors.phone;
    setErrors(errs);
    if (errs.number || errs.phone) return;

    const n = num.trim().toUpperCase();
    const p = normalizePhone(ph);
    let found = await trigger({ orderNumber: n, phone: p }, false)
      .unwrap()
      .catch(() => null);

    // রিফ্রেশের পর ফেক ডেটা হারালেও সর্বশেষ অর্ডারটা এই ব্রাউজারে খুঁজে পাওয়া যায়
    if (!found) {
      const last = loadLastOrder();
      if (last && last.orderNumber.toUpperCase() === n && last.phone === p)
        found = last;
    }
    setResult(found);
  }

  // অ্যাকাউন্ট পেজ থেকে ?order=..&phone=.. নিয়ে এলে নিজে থেকে খোঁজে
  useEffect(() => {
    if (auto.current) return;
    const o = params.get("order");
    const p = params.get("phone");
    if (o && p) {
      auto.current = true;
      void search(o, p);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void search(number, phone);
  }

  const seed =
    process.env.NODE_ENV !== "production"
      ? seedOrders.find((o) => o.id === "o-1001")
      : undefined;

  const division = result
    ? DIVISIONS.find((d) => d.key === result.address.division)
    : undefined;
  const district = result
    ? division?.districts.find((d) => d.key === result.address.district)
    : undefined;

  return (
    <div className="mx-auto max-w-3xl">
      <form
        onSubmit={onSubmit}
        noValidate
        className="rounded-(--radius) border border-border p-5 sm:p-6"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="t-number" label={t.orderNumber} error={errors.number}>
            <input
              id="t-number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="ORD-1001"
              autoCapitalize="characters"
              className={inputCls(!!errors.number)}
            />
          </Field>
          <Field id="t-phone" label={t.phone} error={errors.phone}>
            <input
              id="t-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="tel"
              inputMode="tel"
              placeholder="01XXXXXXXXX"
              className={inputCls(!!errors.phone)}
            />
          </Field>
        </div>
        <button
          type="submit"
          disabled={isFetching}
          className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary font-semibold text-primary-foreground disabled:opacity-60 sm:w-auto sm:px-8"
        >
          {isFetching ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <Search className="size-5" />
          )}
          {isFetching ? t.searching : t.submit}
        </button>

        {seed && (
          <p className="mt-4 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
            {t.demoHint}: <b dir="ltr">{seed.orderNumber}</b> ·{" "}
            <b dir="ltr">{seed.phone}</b>{" "}
            <button
              type="button"
              className="font-medium text-primary underline"
              onClick={() => {
                setNumber(seed.orderNumber);
                setPhone(seed.phone);
              }}
            >
              {t.fill}
            </button>
          </p>
        )}
      </form>

      {result === null && (
        <p
          role="alert"
          className="mt-6 rounded-(--radius) bg-rose-500/10 p-4 text-sm font-medium text-rose-700 dark:text-rose-400"
        >
          {t.notFound}
        </p>
      )}

      {result && (
        <div className="mt-6 space-y-6">
          <section className="rounded-(--radius) border border-border p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-muted-foreground">{t.orderNumber}</p>
                <p className="text-xl font-bold" dir="ltr">
                  {result.orderNumber}
                </p>
              </div>
              <OrderStatusBadge status={result.status} />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {t.placedOn}: {formatDate(result.createdAt, locale)}
            </p>
            <div className="mt-6">
              <OrderTimeline order={result} />
            </div>
            {result.courier && (
              <dl className="mt-6 grid gap-3 border-t border-border pt-5 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-muted-foreground">{t.courier}</dt>
                  <dd className="font-medium capitalize">{result.courier}</dd>
                </div>
                {result.trackingId && (
                  <div>
                    <dt className="text-muted-foreground">{t.trackingId}</dt>
                    <dd className="font-medium" dir="ltr">
                      {result.trackingId}
                    </dd>
                  </div>
                )}
              </dl>
            )}
          </section>

          <section className="rounded-(--radius) border border-border p-5 sm:p-6">
            <h2 className="font-semibold">{t.items}</h2>
            <ul className="mt-4 space-y-4">
              {result.items.map((it, i) => {
                const variant = it.variant
                  ?.split(" / ")
                  .map((v) => optionValue(dict, v))
                  .join(" / ");
                return (
                  <li
                    key={`${it.productId}-${i}`}
                    className="flex items-center gap-3"
                  >
                    <span className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={it.image}
                        alt=""
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">
                        {productLabel(dict, {
                          slug: it.productId.replace(/^p-/, ""),
                          name: it.name,
                        })}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {variant ? `${variant} · ` : ""}× {it.quantity}
                      </span>
                    </span>
                    <span className="text-sm font-medium">
                      {formatPrice(it.price * it.quantity, locale)}
                    </span>
                  </li>
                );
              })}
            </ul>
            <dl className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">
                  {dict.checkout.subtotal}
                </dt>
                <dd>{formatPrice(result.subtotal, locale)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">
                  {dict.checkout.shipping}
                </dt>
                <dd>
                  {result.shipping === 0
                    ? dict.checkout.free
                    : formatPrice(result.shipping, locale)}
                </dd>
              </div>
              {result.discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <dt>{dict.checkout.discount}</dt>
                  <dd>-{formatPrice(result.discount, locale)}</dd>
                </div>
              )}
              <div className="flex justify-between text-base font-bold">
                <dt>{dict.checkout.total}</dt>
                <dd>{formatPrice(result.total, locale)}</dd>
              </div>
            </dl>
            <div className="mt-5 grid gap-4 border-t border-border pt-5 text-sm sm:grid-cols-2">
              <div>
                <p className="text-muted-foreground">{t.deliverTo}</p>
                <p className="mt-1">
                  {[
                    result.address.line,
                    result.address.thana,
                    district
                      ? placeLabel(district, locale)
                      : result.address.district,
                  ].join(", ")}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">{t.payment}</p>
                <p className="mt-1 font-medium">
                  {dict.footer.methods[result.paymentMethod]} ·{" "}
                  {dict.paymentStatus[result.paymentStatus]}
                </p>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
