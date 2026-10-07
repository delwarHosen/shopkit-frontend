"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Field, inputCls } from "@/components/checkout/Field";
import { customers } from "@/data/customers";
import { useDictionary, useLocale } from "@/i18n/I18nProvider";
import { fill, localizePath } from "@/i18n/i18n-utils";
import { toAsciiDigits } from "@/lib/product-query";
import { isValidPhone, normalizePhone } from "@/lib/validators";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { login } from "@/store/slices/authSlice";

// ডেমো: আসল সিস্টেমে SMS গেটওয়ে (যেমন SSL Wireless/BulkSMSBD) দিয়ে OTP যাবে ও সার্ভারে যাচাই হবে
const DEMO_OTP = "123456";

export function LoginForm() {
  const dict = useDictionary();
  const locale = useLocale();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const t = dict.login;

  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<{
    phone?: string;
    otp?: string;
    name?: string;
  }>({});
  const [sending, setSending] = useState(false);

  // আগে থেকে লগইন থাকলে সরাসরি অ্যাকাউন্টে
  useEffect(() => {
    if (user) router.replace(localizePath(locale, "/account"));
  }, [user, router, locale]);

  async function sendOtp(e: FormEvent) {
    e.preventDefault();
    if (!isValidPhone(phone)) return setErrors({ phone: t.errors.phone });
    setErrors({});
    setSending(true);
    await new Promise((r) => setTimeout(r, 600)); // ফেক SMS পাঠানো
    setSending(false);
    const known = customers.find((c) => c.phone === normalizePhone(phone));
    if (known) setName(known.name);
    setStep("otp");
  }

  function verify(e: FormEvent) {
    e.preventDefault();
    const errs: typeof errors = {};
    if (toAsciiDigits(otp).trim() !== DEMO_OTP) errs.otp = t.errors.otp;
    if (name.trim().length < 2) errs.name = t.errors.name;
    setErrors(errs);
    if (errs.otp || errs.name) return;
    dispatch(login({ name: name.trim(), phone: normalizePhone(phone) }));
    router.replace(localizePath(locale, "/account"));
  }

  const btn =
    "flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary font-semibold text-primary-foreground disabled:opacity-60";

  return (
    <div className="mx-auto max-w-md rounded-(--radius) border border-border p-6 sm:p-8">
      <h1 className="text-2xl font-bold">{t.title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t.subtitle}</p>

      {step === "phone" ? (
        <form onSubmit={sendOtp} noValidate className="mt-6 space-y-4">
          <Field id="l-phone" label={t.phone} error={errors.phone}>
            <input
              id="l-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="01XXXXXXXXX"
              autoFocus
              className={inputCls(!!errors.phone)}
            />
          </Field>
          <button type="submit" disabled={sending} className={btn}>
            {sending && <Loader2 className="size-5 animate-spin" />}
            {sending ? t.sending : t.sendOtp}
          </button>
        </form>
      ) : (
        <form onSubmit={verify} noValidate className="mt-6 space-y-4">
          <p className="text-sm text-muted-foreground">
            {fill(t.otpSent, { phone: normalizePhone(phone) })}{" "}
            <button
              type="button"
              className="font-medium text-primary underline"
              onClick={() => {
                setStep("phone");
                setOtp("");
                setErrors({});
              }}
            >
              {t.changePhone}
            </button>
          </p>
          <Field id="l-otp" label={t.otp} error={errors.otp}>
            <input
              id="l-otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              inputMode="numeric"
              maxLength={6}
              autoComplete="one-time-code"
              autoFocus
              className={`${inputCls(!!errors.otp)} tracking-[0.4em]`}
            />
          </Field>
          <Field id="l-name" label={t.name} error={errors.name}>
            <input
              id="l-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              className={inputCls(!!errors.name)}
            />
          </Field>
          <button type="submit" className={btn}>
            {t.verify}
          </button>
        </form>
      )}

      <p className="mt-5 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
        {t.demo}
      </p>
    </div>
  );
}
