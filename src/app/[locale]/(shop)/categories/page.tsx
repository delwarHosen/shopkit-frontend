import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { containerCls } from "@/components/layout/styles";
import { Breadcrumbs } from "@/components/shop/Breadcrumbs";
import { CategoryGrid } from "@/components/shop/CategoryGrid";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getCategories } from "@/lib/services";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return { title: dict.nav.categories };
}

export default async function CategoriesPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const [dict, categories] = await Promise.all([
    getDictionary(locale),
    getCategories(),
  ]);

  return (
    <div className={`${containerCls} py-6 sm:py-10`}>
      <Breadcrumbs
        items={[
          { label: dict.listing.home, href: "/" },
          { label: dict.nav.categories },
        ]}
        locale={locale}
      />
      <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
        {dict.header.allCategories}
      </h1>
      <p className="mt-1 text-muted-foreground">
        {dict.listing.categoriesSubtitle}
      </p>
      <div className="mt-8">
        <CategoryGrid categories={categories} dict={dict} locale={locale} />
      </div>
    </div>
  );
}
