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
