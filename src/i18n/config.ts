import { clientConfig } from "@/config/client";

export const locales = clientConfig.languages;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = locales[0];
export const LOCALE_COOKIE = "NEXT_LOCALE";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
