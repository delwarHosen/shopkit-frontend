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
  return {
    title: dict.nav.offers,
    robots: filtered ? { index: false, follow: true } : undefined,
  };
}

export default async function OffersPage({ params, searchParams }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <ProductListing
      locale={locale}
      dict={dict}
      basePath="/offers"
      searchParams={await searchParams}
      title={dict.nav.offers}
      subtitle={dict.listing.offersSubtitle}
      fixed={{ onSale: true }}
      crumbs={[
        { label: dict.listing.home, href: "/" },
        { label: dict.nav.offers },
      ]}
    />
  );
}
