"use client";

import { clientConfig } from "@/config/client";
import { useLocale } from "@/i18n/I18nProvider";
import { LocaleLink } from "@/i18n/LocaleLink";

export function Logo({ className = "" }: { className?: string }) {
  const locale = useLocale();
  const name = clientConfig.name[locale];
  return (
    <LocaleLink href="/" className={`flex items-center gap-2 ${className}`}>
      <span className="grid size-9 place-items-center rounded-(--radius) bg-primary font-bold text-primary-foreground">
        {Array.from(name)[0]}
      </span>
      <span className="text-lg font-bold tracking-tight">{name}</span>
    </LocaleLink>
  );
}
