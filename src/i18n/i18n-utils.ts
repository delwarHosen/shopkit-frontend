import type { CategoryWithCount } from "@/types/shop";
import { isLocale, type Locale } from "./config";
import type { Dictionary } from "./dictionaries/bn";

/** "/products" -> "/bn/products" */
export function localizePath(locale: Locale, path: string) {
  if (!path.startsWith("/")) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

/** "/bn/products" -> "/products" */
export function stripLocale(pathname: string) {
  const seg = pathname.split("/")[1];
  if (seg && isLocale(seg)) return pathname.slice(seg.length + 1) || "/";
  return pathname;
}

/** বর্তমান পেজের একই পথ, শুধু অন্য ভাষায় */
export function switchLocalePath(pathname: string, to: Locale) {
  return localizePath(to, stripLocale(pathname));
}

export function isActive(current: string, href: string) {
  const path = href.split("?")[0];
  return path === "/"
    ? current === "/"
    : current === path || current.startsWith(`${path}/`);
}

export function categoryLabel(
  dict: Dictionary,
  c: Pick<CategoryWithCount, "slug" | "name">,
) {
  return (dict.categoryNames as Record<string, string>)[c.slug] ?? c.name;
}

/** পণ্যের নাম বর্তমান ভাষায় (ডিকশনারিতে না থাকলে মূল নাম) */
export function productLabel(
  dict: Dictionary,
  p: { slug: string; name: string },
) {
  return (dict.productNames as Record<string, string>)[p.slug] ?? p.name;
}

/** ব্যানারের লেখা বর্তমান ভাষায় */
export function bannerText(
  dict: Dictionary,
  b: { id: string; title: string; subtitle: string; cta: string },
) {
  return (
    (
      dict.banners as Record<
        string,
        { title: string; subtitle: string; cta: string }
      >
    )[b.id] ?? b
  );
}

/** "মাত্র {n}টি বাকি" ধরনের টেমপ্লেটে মান বসায় */
export function fill(
  template: string,
  values: Record<string, string | number>,
) {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(values[k] ?? ""));
}
