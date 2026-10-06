import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductListing } from "@/components/shop/ProductListing";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import {
  hasFilters,
  parseListing,
  type RawSearchParams,
} from "@/lib/product-query";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<RawSearchParams>;
};

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  const filtered = hasFilters(parseListing(await searchParams));
  // ফিল্টার/সার্চ করা URL সার্চ ইঞ্জিনে ইনডেক্স হবে না
  return {
    title: dict.listing.title,
    robots: filtered ? { index: false, follow: true } : undefined,
  };
}

export default async function ProductsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <ProductListing
      locale={locale}
      dict={dict}
      basePath="/products"
      searchParams={await searchParams}
      title={dict.listing.title}
      crumbs={[
        { label: dict.listing.home, href: "/" },
        { label: dict.listing.title },
      ]}
    />
  );
}
