import type { Dictionary } from "@/i18n/dictionaries/bn";

// রঙের অপশনের নাম। ডেটায় অপশনের নাম "রঙ" হলে সুইচ (গোল রঙ) আকারে দেখাবে
export const COLOR_OPTION = "রঙ";

export const SWATCHES: Record<string, string> = {
  সাদা: "#ffffff",
  নীল: "#2563eb",
  ধূসর: "#9ca3af",
  "অফ হোয়াইট": "#f5f1e8",
  মেরুন: "#7f1d1d",
  বেইজ: "#d6c2a0",
  কালো: "#111827",
  সবুজ: "#16a34a",
  লাল: "#dc2626",
  পিচ: "#fdba9b",
  হলুদ: "#facc15",
  গোলাপি: "#f472b6",
  আকাশি: "#7dd3fc",
  বাদামি: "#78350f",
  ট্যান: "#b9835a",
  নেভি: "#1e3a8a",
  সিলভার: "#cbd5e1",
  গোল্ড: "#d4a017",
  অলিভ: "#6b7a2c",
};

export const optionName = (dict: Dictionary, name: string) =>
  (dict.options.names as Record<string, string>)[name] ?? name;

export const optionValue = (dict: Dictionary, value: string) =>
  (dict.options.values as Record<string, string>)[value] ?? value;

export const brandLabel = (dict: Dictionary, brand: string) =>
  (dict.brands as Record<string, string>)[brand] ?? brand;
