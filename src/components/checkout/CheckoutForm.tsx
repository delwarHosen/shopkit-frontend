"use client";

import {
  Banknote,
  Check,
  CreditCard,
  Loader2,
  Lock,
  Smartphone,
  Tag,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { clientConfig } from "@/config/client";
import { DIVISIONS, placeLabel } from "@/data/locations";
import { useDictionary, useLocale } from "@/i18n/I18nProvider";
import { fill, localizePath } from "@/i18n/i18n-utils";
import { LocaleLink } from "@/i18n/LocaleLink";
import { formatPrice } from "@/lib/format";
import { saveLastOrder } from "@/lib/last-order";
import { applyCoupon, calcShipping } from "@/lib/pricing";
import { isValidEmail, isValidPhone, normalizePhone } from "@/lib/validators";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { usePlaceOrderMutation } from "@/store/api/hooks";
import {
  clearCart,
  selectCartItems,
  selectCartSubtotal,
} from "@/store/slices/cartSlice";
import type { PaymentMethod } from "@/types/shop";
import { Field, inputCls } from "./Field";
import { OrderSummary } from "./OrderSummary";

type FormState = {
  name: string;
  phone: string;
  email: string;
  division: string;
  district: string;
  thana: string;
  line: string;
  note: string;
  trxId: string;
};
type Errors = Partial<Record<keyof FormState, string>>;

const EMPTY: FormState = {
  name: "",
  phone: "",
  email: "",
  division: "",
  district: "",
  thana: "",
  line: "",
  note: "",
  trxId: "",
};
const FIELD_ORDER: (keyof FormState)[] = [
  "name",
  "phone",
  "email",
  "division",
  "district",
  "thana",
  "line",
  "trxId",
];
const METHODS = (["cod", "bkash", "nagad", "card"] as const).filter(
  (m) => clientConfig.features[m],
);
const ICONS = {
  cod: Banknote,
  bkash: Smartphone,
  nagad: Smartphone,
  card: CreditCard,
} as const;

export function CheckoutForm() {
  const dict = useDictionary();
  const locale = useLocale();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartSubtotal);
  const hydrated = useAppSelector((s) => s.cart.hydrated);
  const [placeOrder, { isLoading }] = usePlaceOrderMutation();

  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [method, setMethod] = useState<PaymentMethod>(METHODS[0] ?? "cod");
  const [couponInput, setCouponInput] = useState("");
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const submitted = useRef(false); // অর্ডার হওয়ার পর "কার্ট খালি" ঝলক এড়াতে

  const t = dict.checkout;
  const division = DIVISIONS.find((d) => d.key === form.division);

  // মোট হিসাব (সার্ভিসেও একই হিসাব আবার হয়)
  const baseShipping = calcShipping(form.district || undefined, subtotal);
  const coupon = appliedCode ? applyCoupon(appliedCode, subtotal) : null;
  const couponOk = coupon && coupon.ok ? coupon : null;
  const shipping =
    baseShipping == null ? null : couponOk?.freeShipping ? 0 : baseShipping;
  const discount = couponOk?.discount ?? 0;
  const total = subtotal - discount + (shipping ?? 0);

  const set =
    (key: keyof FormState) =>
    (
      e: ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) => {
      const value = e.target.value;
      setForm((f) => ({
        ...f,
        [key]: value,
        ...(key === "division" ? { district: "" } : {}),
      }));
      if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
    };

  const needsTrx = method === "bkash" || method === "nagad";

  function validate(): Errors {
    const e: Errors = {};
    if (form.name.trim().length < 2) e.name = t.errors.name;
    if (!isValidPhone(form.phone)) e.phone = t.errors.phone;
    if (form.email.trim() && !isValidEmail(form.email))
      e.email = t.errors.email;
    if (!form.division) e.division = t.errors.division;
    if (!form.district) e.district = t.errors.district;
    if (!form.thana.trim()) e.thana = t.errors.required;
    if (form.line.trim().length < 5) e.line = t.errors.required;
    if (needsTrx && form.trxId.trim().length < 6) e.trxId = t.errors.trxId;
    return e;
  }

  function applyCode() {
    const r = applyCoupon(couponInput, subtotal);
    if (r.ok) {
      setAppliedCode(r.code);
      setCouponError(null);
      setCouponInput("");
    } else {
      setCouponError(
        r.reason === "min"
          ? fill(t.couponMin, { amount: formatPrice(r.min ?? 0, locale) })
          : t.couponInvalid,
      );
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    const errs = validate();
    setErrors(errs);
    const firstBad = FIELD_ORDER.find((k) => errs[k]);
    if (firstBad) {
      document.getElementById(`f-${firstBad}`)?.focus();
      return;
    }

    try {
      const order = await placeOrder({
        name: form.name.trim(),
        phone: normalizePhone(form.phone),
        email: form.email.trim() || undefined,
        address: {
          line: form.line.trim(),
          thana: form.thana.trim(),
          district: form.district,
          division: form.division,
        },
        items: items.map((i) => ({
          productId: i.productId,
          name: i.name,
          image: i.image,
          price: i.price,
          quantity: i.quantity,
          variant: i.variant,
        })),
        paymentMethod: method,
        trxId: needsTrx ? form.trxId.trim() : undefined,
        note: form.note.trim() || undefined,
        couponCode: couponOk?.code,
      }).unwrap();

      submitted.current = true;
      saveLastOrder(order);
      dispatch(clearCart());
      router.push(localizePath(locale, "/order-success"));
    } catch {
      setSubmitError(t.failed);
    }
  }

  if (!hydrated) {
    return (
      <div
        className="mt-8 h-96 animate-pulse rounded-(--radius) bg-muted"
        aria-busy
      />
    );
  }

  if (items.length === 0 && !submitted.current) {
    return (
      <div className="mt-10 rounded-(--radius) border border-dashed border-border px-6 py-16 text-center">
        <h2 className="text-xl font-semibold">{dict.cart.empty}</h2>
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

  const card = "rounded-(--radius) border border-border p-5 sm:p-6";
  const heading = "mb-5 text-lg font-semibold";
  const bind = (k: keyof FormState) => ({
    id: `f-${k}`,
    "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": errors[k] ? `f-${k}-error` : undefined,
  });

  const payNumber =
    method === "bkash"
      ? clientConfig.payments.bkashNumber
      : clientConfig.payments.nagadNumber;

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_400px]"
    >
      <div className="space-y-6">
        <section className={card}>
          <h2 className={heading}>{t.contact}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field id="f-name" label={t.name} error={errors.name}>
                <input
                  {...bind("name")}
                  value={form.name}
                  onChange={set("name")}
                  autoComplete="name"
                  className={inputCls(!!errors.name)}
                />
              </Field>
            </div>
            <Field id="f-phone" label={t.phone} error={errors.phone}>
              <input
                {...bind("phone")}
                value={form.phone}
                onChange={set("phone")}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="01XXXXXXXXX"
                className={inputCls(!!errors.phone)}
              />
            </Field>
            <Field
              id="f-email"
              label={t.email}
              error={errors.email}
              optionalLabel={t.optional}
            >
              <input
                {...bind("email")}
                value={form.email}
                onChange={set("email")}
                type="email"
                autoComplete="email"
                className={inputCls(!!errors.email)}
              />
            </Field>
          </div>
        </section>

        <section className={card}>
          <h2 className={heading}>{t.address}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="f-division" label={t.division} error={errors.division}>
              <select
                {...bind("division")}
                value={form.division}
                onChange={set("division")}
                className={inputCls(!!errors.division)}
              >
                <option value="">{t.selectDivision}</option>
                {DIVISIONS.map((d) => (
                  <option key={d.key} value={d.key}>
                    {placeLabel(d, locale)}
                  </option>
                ))}
              </select>
            </Field>
            <Field id="f-district" label={t.district} error={errors.district}>
              <select
                {...bind("district")}
                value={form.district}
                onChange={set("district")}
                disabled={!division}
                className={`${inputCls(!!errors.district)} disabled:opacity-60`}
              >
                <option value="">{t.selectDistrict}</option>
                {division?.districts.map((d) => (
                  <option key={d.key} value={d.key}>
                    {placeLabel(d, locale)}
                  </option>
                ))}
              </select>
            </Field>
            <div className="sm:col-span-2">
              <Field id="f-thana" label={t.thana} error={errors.thana}>
                <input
                  {...bind("thana")}
                  value={form.thana}
                  onChange={set("thana")}
                  autoComplete="address-level2"
                  className={inputCls(!!errors.thana)}
                />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field id="f-line" label={t.line} error={errors.line}>
                <input
                  {...bind("line")}
                  value={form.line}
                  onChange={set("line")}
                  autoComplete="street-address"
                  className={inputCls(!!errors.line)}
                />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field id="f-note" label={t.note} optionalLabel={t.optional}>
                <textarea
                  id="f-note"
                  value={form.note}
                  onChange={set("note")}
                  rows={2}
                  placeholder={t.notePlaceholder}
                  className="w-full rounded-lg border border-border bg-background px-3.5 py-3 text-sm outline-none focus:border-primary"
                />
              </Field>
            </div>
          </div>
        </section>

        <section className={card}>
          <h2 className={heading}>{t.payment}</h2>
          <div role="radiogroup" aria-label={t.payment} className="space-y-3">
            {METHODS.map((m) => {
              const Icon = ICONS[m];
              const active = method === m;
              const desc = {
                cod: t.codText,
                bkash: t.bkashText,
                nagad: t.nagadText,
                card: t.cardText,
              }[m];
              return (
                <div key={m}>
                  <label
                    className={`flex cursor-pointer items-start gap-3 rounded-(--radius) border p-4 transition-colors ${active ? "border-primary bg-primary/5" : "border-border hover:border-foreground/30"}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={m}
                      checked={active}
                      onChange={() => setMethod(m)}
                      className="mt-1 size-4 accent-primary"
                    />
                    <span className="flex-1">
                      <span className="flex items-center gap-2 font-medium">
                        <Icon className="size-4" /> {dict.footer.methods[m]}
                      </span>
                      <span className="mt-0.5 block text-sm text-muted-foreground">
                        {desc}
                      </span>
                    </span>
                  </label>

                  {active && needsTrx && (
                    <div className="mt-3 space-y-4 rounded-(--radius) bg-muted p-4">
                      <div className="grid gap-3 text-sm sm:grid-cols-2">
                        <div>
                          <p className="text-muted-foreground">{t.sendTo}</p>
                          <p
                            className="mt-1 flex items-center gap-2 text-lg font-bold"
                            dir="ltr"
                          >
                            {payNumber}
                            <button
                              type="button"
                              onClick={async () => {
                                try {
                                  await navigator.clipboard.writeText(
                                    payNumber,
                                  );
                                  setCopied(true);
                                  setTimeout(() => setCopied(false), 1800);
                                } catch {}
                              }}
                              className="rounded-md border border-border bg-background px-2 py-0.5 text-xs font-medium"
                            >
                              {copied ? (
                                <Check className="inline size-3.5 text-primary" />
                              ) : (
                                t.copy
                              )}
                            </button>
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">
                            {t.sendAmount}
                          </p>
                          <p className="mt-1 text-lg font-bold">
                            {formatPrice(total, locale)}
                          </p>
                        </div>
                      </div>
                      <Field id="f-trxId" label={t.trxId} error={errors.trxId}>
                        <input
                          {...bind("trxId")}
                          value={form.trxId}
                          onChange={set("trxId")}
                          autoComplete="off"
                          className={inputCls(!!errors.trxId)}
                        />
                      </Field>
                      <p className="-mt-2 text-xs text-muted-foreground">
                        {t.trxHint}
                      </p>
                    </div>
                  )}
                  {active && m === "card" && (
                    <p className="mt-3 rounded-(--radius) bg-muted p-4 text-sm text-muted-foreground">
                      {t.cardNote}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <aside className="lg:sticky lg:top-24">
        <OrderSummary
          items={items}
          subtotal={subtotal}
          shipping={shipping}
          discount={discount}
          total={total}
        >
          <div className="mt-5 border-t border-border pt-5">
            {couponOk ? (
              <div className="flex items-center justify-between rounded-lg bg-emerald-500/10 px-3 py-2.5 text-sm text-emerald-700 dark:text-emerald-400">
                <span className="flex items-center gap-2">
                  <Tag className="size-4" />{" "}
                  {fill(t.couponApplied, { code: couponOk.code })}
                </span>
                <button
                  type="button"
                  onClick={() => setAppliedCode(null)}
                  aria-label={t.removeCoupon}
                >
                  <X className="size-4" />
                </button>
              </div>
            ) : (
              <>
                <label
                  htmlFor="coupon"
                  className="mb-1.5 block text-sm font-medium"
                >
                  {t.coupon}
                </label>
                <div className="flex gap-2">
                  <input
                    id="coupon"
                    value={couponInput}
                    onChange={(e) => {
                      setCouponInput(e.target.value);
                      setCouponError(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        applyCode();
                      }
                    }}
                    placeholder={t.couponPlaceholder}
                    autoCapitalize="characters"
                    className="h-11 min-w-0 flex-1 rounded-lg border border-border bg-background px-3.5 text-sm uppercase outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={applyCode}
                    disabled={!couponInput.trim()}
                    className="h-11 shrink-0 rounded-lg border border-border px-4 text-sm font-medium hover:bg-muted disabled:opacity-50"
                  >
                    {t.apply}
                  </button>
                </div>
                {couponError && (
                  <p
                    role="alert"
                    className="mt-1.5 text-xs font-medium text-rose-600"
                  >
                    {couponError}
                  </p>
                )}
              </>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {isLoading && <Loader2 className="size-5 animate-spin" />}
            {isLoading
              ? t.placing
              : `${t.placeOrder} · ${formatPrice(total, locale)}`}
          </button>
          {submitError && (
            <p
              role="alert"
              className="mt-3 text-center text-sm font-medium text-rose-600"
            >
              {submitError}
            </p>
          )}
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="size-3.5" /> {t.secure}
          </p>
          <LocaleLink
            href="/cart"
            className="mt-2 block text-center text-sm text-muted-foreground hover:text-foreground"
          >
            {t.editCart}
          </LocaleLink>
        </OrderSummary>
      </aside>
    </form>
  );
}
