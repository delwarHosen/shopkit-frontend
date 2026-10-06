import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductListing } from "@/components/shop/ProductListing";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { categoryLabel } from "@/i18n/i18n-utils";
import {
  hasFilters,
  parseListing,
  type RawSearchParams,
} from "@/lib/product-query";
import { getCategoryBySlug } from "@/lib/services";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<RawSearchParams>;
};

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const [dict, category] = await Promise.all([
    getDictionary(locale),
    getCategoryBySlug(slug),
  ]);
  if (!category) return {};
  const filtered = hasFilters(parseListing(await searchParams));
  return {
    title: categoryLabel(dict, category),
    description:
      (dict.categoryDescriptions as Record<string, string>)[slug] ??
      category.description,
    robots: filtered ? { index: false, follow: true } : undefined,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const [dict, category] = await Promise.all([
    getDictionary(locale),
    getCategoryBySlug(slug),
  ]);
  if (!category) notFound();

  const label = categoryLabel(dict, category);

  return (
    <ProductListing
      locale={locale}
      dict={dict}
      basePath={`/categories/${slug}`}
      searchParams={await searchParams}
      title={label}
      subtitle={
        (dict.categoryDescriptions as Record<string, string>)[slug] ??
        category.description
      }
      fixed={{ category: slug }}
      crumbs={[
        { label: dict.listing.home, href: "/" },
        { label: dict.nav.categories, href: "/categories" },
        { label },
      ]}
    />
  );
}
