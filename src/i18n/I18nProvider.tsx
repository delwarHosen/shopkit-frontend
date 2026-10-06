"use client";

import { createContext, useContext } from "react";
import type { Locale } from "./config";
import { Dictionary } from "./dictionaries/bn";

type Ctx = { locale: Locale; dict: Dictionary };
const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({
  locale,
  dict,
  children,
}: Ctx & { children: React.ReactNode }) {
  return (
    <I18nContext.Provider value={{ locale, dict }}>
      {children}
    </I18nContext.Provider>
  );
}

function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("I18nProvider পাওয়া যায়নি");
  return ctx;
}

export const useLocale = () => useI18n().locale;
export const useDictionary = () => useI18n().dict;
