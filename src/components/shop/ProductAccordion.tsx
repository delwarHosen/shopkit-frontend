import { Check, ChevronDown } from "lucide-react";
import { clientConfig } from "@/config/client";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/bn";
import { fill } from "@/i18n/i18n-utils";
import { brandLabel } from "@/lib/product-options";
import type { Product } from "@/types/shop";

export function productDescription(
  product: Product,
  dict: Dictionary,
  locale: Locale,
  name: string,
) {
  return locale === "bn"
    ? product.description
    : fill(dict.detail.descriptionTemplate, {
        name,
        brand: brandLabel(dict, product.brand),
      });
}

function Item({
  title,
  open,
  children,
}: {
  title: string;
  open?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details open={open} className="group border-b border-border py-4">
      <summary className="flex cursor-pointer list-none items-center justify-between font-semibold [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown className="size-5 text-muted-foreground transition-transform group-open:rotate-180" />
      </summary>
      <div className="pt-3 text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </details>
  );
}

type Props = {
  product: Product;
  dict: Dictionary;
  locale: Locale;
  name: string;
};

export function ProductAccordion({ product, dict, locale, name }: Props) {
  const highlights =
    (dict.detail.highlightsByCategory as Record<string, string[]>)[
      product.categoryId
    ] ?? product.highlights;

  return (
    <div className="border-t border-border">
      <Item title={dict.detail.description} open>
        <p>{productDescription(product, dict, locale, name)}</p>
      </Item>
      <Item title={dict.detail.highlights}>
        <ul className="space-y-2">
          {highlights.map((h) => (
            <li key={h} className="flex items-start gap-2">
              <Check className="mt-0.5 size-4 shrink-0 text-primary" /> {h}
            </li>
          ))}
        </ul>
      </Item>
      <Item title={dict.detail.delivery}>
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <Check className="mt-0.5 size-4 shrink-0 text-primary" />{" "}
            {dict.detail.deliveryHome}
          </li>
          {clientConfig.features.cod && (
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 size-4 shrink-0 text-primary" />{" "}
              {dict.detail.deliveryCod}
            </li>
          )}
          <li className="flex items-start gap-2">
            <Check className="mt-0.5 size-4 shrink-0 text-primary" />{" "}
            {dict.detail.deliveryExchange}
          </li>
        </ul>
      </Item>
    </div>
  );
}
