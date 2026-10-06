import Image from "next/image";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/bn";
import { fill } from "@/i18n/i18n-utils";
import { LocaleLink } from "@/i18n/LocaleLink";
import { formatNumber } from "@/lib/format";

type Props = {
  dict: Dictionary;
  locale: Locale;
  percent: number;
  image?: string;
};

export function PromoBanner({ dict, locale, percent, image }: Props) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-primary text-primary-foreground">
      <div className="pointer-events-none absolute -inset-e-16 -top-16 size-64 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-24 inset-s-1/3 size-72 rounded-full bg-black/10" />

      <div className="relative grid items-center gap-8 px-6 py-10 sm:px-12 md:grid-cols-[1.2fr_1fr] md:py-14">
        <div>
          <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
            {dict.home.promoBadge}
          </span>
          <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-5xl">
            {fill(dict.home.promoTitle, {
              percent: formatNumber(percent, locale),
            })}
          </h2>
          <p className="mt-3 max-w-md text-primary-foreground/85">
            {dict.home.promoText}
          </p>
          <LocaleLink
            href="/offers"
            className="mt-6 inline-flex h-12 items-center rounded-full bg-white px-7 font-semibold text-primary transition-transform hover:scale-[1.03]"
          >
            {dict.home.shopNow}
          </LocaleLink>
        </div>

        {image && (
          <div className="relative mx-auto hidden aspect-4/5 w-56 rotate-3 overflow-hidden rounded-2xl shadow-2xl ring-4 ring-white/30 md:block">
            <Image
              src={image}
              alt=""
              fill
              sizes="224px"
              className="object-cover"
            />
          </div>
        )}
      </div>
    </section>
  );
}
