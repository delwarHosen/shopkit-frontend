import type { Locale } from "./config";
import { Dictionary } from "./dictionaries/bn";

const loaders: Record<Locale, () => Promise<Dictionary>> = {
  bn: () => import("./dictionaries/bn").then((m) => m.bn),
  en: () => import("./dictionaries/en").then((m) => m.en),
};

// সার্ভার কম্পোনেন্টে ব্যবহার করুন
export const getDictionary = (locale: Locale) => loaders[locale]();
