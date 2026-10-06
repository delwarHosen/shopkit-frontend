import { BadgeCheck } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries/bn";
import { productLabel } from "@/i18n/i18n-utils";
import { LocaleLink } from "@/i18n/LocaleLink";
import type { ReviewWithProduct } from "@/lib/services";
import { Stars } from "./Stars";

export function ReviewsSection({
  reviews,
  dict,
}: {
  reviews: ReviewWithProduct[];
  dict: Dictionary;
}) {
  return (
    <ul className="grid gap-4 md:grid-cols-3">
      {reviews.map((r) => (
        <li
          key={r.id}
          className="flex flex-col rounded-(--radius) border border-border p-5"
        >
          <Stars rating={r.rating} />
          <p className="mt-3 flex-1 text-sm leading-relaxed">“{r.comment}”</p>
          <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-3 text-xs">
            <div>
              <p className="font-semibold">{r.author}</p>
              {r.verified && (
                <p className="mt-0.5 flex items-center gap-1 text-primary">
                  <BadgeCheck className="size-3.5" /> {dict.home.verified}
                </p>
              )}
            </div>
            <LocaleLink
              href={`/products/${r.productSlug}`}
              className="truncate text-muted-foreground hover:text-foreground"
            >
              {productLabel(dict, { slug: r.productSlug, name: r.productName })}
            </LocaleLink>
          </div>
        </li>
      ))}
    </ul>
  );
}
