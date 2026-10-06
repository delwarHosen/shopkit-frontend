"use client";

import { useState, type FormEvent } from "react";
import { useDictionary } from "@/i18n/I18nProvider";

// এখন শুধু UI। আসল সাবস্ক্রিপশন ব্যাকএন্ড যোগ হলে এখানে API কল বসবে
export function NewsletterForm() {
  const dict = useDictionary();
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (email.trim()) setDone(true);
  }

  if (done)
    return (
      <p className="text-sm font-medium text-primary">
        {dict.footer.newsletterThanks}
      </p>
    );

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-md gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={dict.footer.newsletterPlaceholder}
        aria-label={dict.footer.newsletterPlaceholder}
        className="h-11 min-w-0 flex-1 rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary"
      />
      <button
        type="submit"
        className="h-11 shrink-0 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        {dict.footer.newsletterButton}
      </button>
    </form>
  );
}
