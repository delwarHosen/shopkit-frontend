"use client";

import { Heart, LogOut, Package } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Field, inputCls } from "@/components/checkout/Field";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { clientConfig } from "@/config/client";
import { useDictionary, useLocale } from "@/i18n/I18nProvider";
import { fill, localizePath } from "@/i18n/i18n-utils";
import { LocaleLink } from "@/i18n/LocaleLink";
import { formatDate, formatNumber, formatPrice } from "@/lib/format";
import { loadLastOrder } from "@/lib/last-order";
import { isValidEmail } from "@/lib/validators";
import { useGetOrdersQuery } from "@/store/api/hooks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout, updateProfile } from "@/store/slices/authSlice";
import { selectWishlistCount } from "@/store/slices/wishlistSlice";
import type { Order } from "@/types/shop";

export function AccountView() {
  const dict = useDictionary();
  const locale = useLocale();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const hydrated = useAppSelector((s) => s.auth.hydrated);
  const wishCount = useAppSelector(selectWishlistCount);
  const t = dict.account;

  const [tab, setTab] = useState<"orders" | "profile">("orders");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string>();
  const [saved, setSaved] = useState(false);

  const { data, isLoading } = useGetOrdersQuery(
    { q: user?.phone, pageSize: 50 },
    { skip: !user },
  );

  // লগইন না থাকলে লগইন পেজে পাঠায়
  useEffect(() => {
    if (hydrated && !user) router.replace(localizePath(locale, "/login"));
  }, [hydrated, user, router, locale]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email ?? "");
    }
  }, [user]);

  // ফেক ডেটা রিফ্রেশে হারালেও সর্বশেষ অর্ডারটা দেখানোর জন্য ব্রাউজারে রাখা কপি যোগ করে
  const orders: Order[] = useMemo(() => {
    const list = data?.items ?? [];
    const last = typeof window !== "undefined" ? loadLastOrder() : null;
    if (
      last &&
      user &&
      last.phone === user.phone &&
      !list.some((o) => o.orderNumber === last.orderNumber)
    ) {
      return [last, ...list];
    }
    return list;
  }, [data, user]);

  if (!hydrated || !user) {
    return (
      <div
        className="mt-8 h-64 animate-pulse rounded-(--radius) bg-muted"
        aria-busy
        aria-label={t.loginRequired}
      />
    );
  }

  function saveProfile(e: FormEvent) {
    e.preventDefault();
    if (email.trim() && !isValidEmail(email))
      return setEmailError(dict.checkout.errors.email);
    setEmailError(undefined);
    dispatch(
      updateProfile({
        name: name.trim() || user!.name,
        email: email.trim() || undefined,
      }),
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const tabBtn = (active: boolean) =>
    `rounded-full px-5 py-2 text-sm font-medium transition-colors ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`;

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-(--radius) bg-muted p-5">
        <div className="flex items-center gap-4">
          <span className="grid size-14 place-items-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
            {Array.from(user.name)[0]}
          </span>
          <div>
            <p className="text-lg font-semibold">
              {fill(t.hello, { name: user.name })}
            </p>
            <p className="text-sm text-muted-foreground" dir="ltr">
              {user.phone}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {clientConfig.features.wishlist && (
            <LocaleLink
              href="/wishlist"
              className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-medium"
            >
              <Heart className="size-4" /> {dict.wishlist.title}
              {wishCount > 0 && (
                <span className="text-muted-foreground">
                  ({formatNumber(wishCount, locale)})
                </span>
              )}
            </LocaleLink>
          )}
          <button
            type="button"
            onClick={() => {
              dispatch(logout());
              router.replace(localizePath(locale, "/"));
            }}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-medium hover:text-rose-600"
          >
            <LogOut className="size-4" /> {t.logout}
          </button>
        </div>
      </div>

      <div role="tablist" className="mt-6 flex gap-2">
        <button
          role="tab"
          aria-selected={tab === "orders"}
          onClick={() => setTab("orders")}
          className={tabBtn(tab === "orders")}
        >
          {t.orders}
        </button>
        <button
          role="tab"
          aria-selected={tab === "profile"}
          onClick={() => setTab("profile")}
          className={tabBtn(tab === "profile")}
        >
          {t.profile}
        </button>
      </div>

      {tab === "orders" ? (
        <div className="mt-6">
          {isLoading ? (
            <div className="space-y-3">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="h-28 animate-pulse rounded-(--radius) bg-muted"
                />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="grid place-items-center rounded-(--radius) border border-dashed border-border px-6 py-16 text-center">
              <Package className="size-10 text-muted-foreground" />
              <h2 className="mt-4 text-lg font-semibold">{t.noOrders}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {t.noOrdersText}
              </p>
              <LocaleLink
                href="/products"
                className="mt-6 inline-flex h-11 items-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground"
              >
                {dict.cart.continue}
              </LocaleLink>
            </div>
          ) : (
            <ul className="space-y-4">
              {orders.map((o) => (
                <li
                  key={o.id}
                  className="rounded-(--radius) border border-border p-4 sm:p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-bold" dir="ltr">
                        {o.orderNumber}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(o.createdAt, locale)}
                      </p>
                    </div>
                    <OrderStatusBadge status={o.status} />
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-4">
                    <div className="flex -space-x-2 rtl:space-x-reverse">
                      {o.items.slice(0, 4).map((it, i) => (
                        <span
                          key={i}
                          className="relative size-11 overflow-hidden rounded-lg border-2 border-background bg-muted"
                        >
                          <Image
                            src={it.image}
                            alt=""
                            fill
                            sizes="44px"
                            className="object-cover"
                          />
                        </span>
                      ))}
                      <span className="grid place-items-center ps-4 text-xs text-muted-foreground">
                        {fill(t.orderItems, {
                          n: formatNumber(o.items.length, locale),
                        })}
                      </span>
                    </div>
                    <div className="text-end">
                      <p className="font-bold">
                        {formatPrice(o.total, locale)}
                      </p>
                      <LocaleLink
                        href={`/track-order?order=${o.orderNumber}&phone=${o.phone}`}
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        {t.track} →
                      </LocaleLink>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <form
          onSubmit={saveProfile}
          noValidate
          className="mt-6 max-w-lg space-y-4 rounded-(--radius) border border-border p-5 sm:p-6"
        >
          <Field id="p-name" label={t.name}>
            <input
              id="p-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputCls(false)}
            />
          </Field>
          <Field id="p-phone" label={dict.login.phone}>
            <input
              id="p-phone"
              value={user.phone}
              disabled
              dir="ltr"
              className={`${inputCls(false)} opacity-60`}
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              {t.phoneLocked}
            </p>
          </Field>
          <Field
            id="p-email"
            label={t.email}
            error={emailError}
            optionalLabel={dict.checkout.optional}
          >
            <input
              id="p-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputCls(!!emailError)}
            />
          </Field>
          <button
            type="submit"
            className="h-12 rounded-full bg-primary px-8 font-semibold text-primary-foreground"
          >
            {saved ? t.saved : t.save}
          </button>
        </form>
      )}
    </div>
  );
}
