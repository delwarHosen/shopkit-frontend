import { toAsciiDigits } from "./product-query";

/** "+8801712-345678" বা "০১৭১২৩৪৫৬৭৮" থেকে "01712345678" */
export function normalizePhone(v: string) {
  return toAsciiDigits(v)
    .replace(/[\s-]/g, "")
    .replace(/^\+?88(?=01)/, "");
}

// বাংলাদেশের মোবাইল: 01 + (3-9) + ৮ ডিজিট
export const isValidPhone = (v: string) =>
  /^01[3-9]\d{8}$/.test(normalizePhone(v));

export const isValidEmail = (v: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
