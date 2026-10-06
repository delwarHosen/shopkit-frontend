"use client";

import { Languages } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { LOCALE_COOKIE, locales } from "@/i18n/config";
import { useDictionary, useLocale } from "@/i18n/I18nProvider";
import { switchLocalePath } from "@/i18n/i18n-utils";

const labels = { bn: "বাংলা", en: "EN" } as const;

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const locale = useLocale();
  const dict = useDictionary();
  const pathname = usePathname();
  const router = useRouter();

  // একটাই ভাষা থাকলে বাটন দেখাবে না
  if (locales.length < 2) return null;
  // এখন ২টা ভাষা, তাই "অন্যটা" বেছে নিলেই হয়
  const next = locales.find((l) => l !== locale) ?? locale;

  function switchLanguage() {
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    // একই পেজ, একই ফিল্টার (query) রেখে ভাষা বদলায়
    router.push(
      switchLocalePath(pathname, next) +
        window.location.search +
        window.location.hash,
    );
  }

  return (
    <button
      type="button"
      onClick={switchLanguage}
      aria-label={`${dict.header.language}: ${labels[next]}`}
      className={`inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${className}`}
    >
      <Languages className="size-4" aria-hidden />
      {labels[next]}
    </button>
  );
}
