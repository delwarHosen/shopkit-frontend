import Image from "next/image";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/bn";
import { categoryLabel } from "@/i18n/i18n-utils";
import { LocaleLink } from "@/i18n/LocaleLink";
import { formatNumber } from "@/lib/format";
import type { CategoryWithCount } from "@/types/shop";

export function CategoryGrid({
  categories,
  dict,
  locale,
}: {
  categories: CategoryWithCount[];
  dict: Dictionary;
  locale: Locale;
}) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
      {categories.map((c) => (
        <li key={c.id}>
          <LocaleLink
            href={`/categories/${c.slug}`}
            className="group relative block aspect-square overflow-hidden rounded-2xl bg-muted"
          >
            <Image
              src={c.image}
              alt=""
              fill
              sizes="(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-3 text-white">
              <p className="text-sm font-semibold leading-tight sm:text-base">
                {categoryLabel(dict, c)}
              </p>
              <p className="mt-0.5 text-xs text-white/80">
                {formatNumber(c.productCount, locale)} {dict.header.products}
              </p>
            </div>
          </LocaleLink>
        </li>
      ))}
    </ul>
  );
}
