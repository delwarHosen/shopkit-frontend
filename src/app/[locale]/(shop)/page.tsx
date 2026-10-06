import { notFound } from "next/navigation";
import { containerCls } from "@/components/layout/styles";
import { CategoryGrid } from "@/components/shop/CategoryGrid";
import { FeaturesStrip } from "@/components/shop/FeaturesStrip";
import { HeroCarousel } from "@/components/shop/HeroCarousel";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProductTabs } from "@/components/shop/ProductTabs";
import { PromoBanner } from "@/components/shop/PromoBanner";
import { ReviewsSection } from "@/components/shop/ReviewsSection";
import { SectionHeading } from "@/components/shop/SectionHeading";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { discountPercent } from "@/lib/format";
import {
  getBanners,
  getBestSellers,
  getCategories,
  getFeaturedProducts,
  getNewArrivals,
  getProducts,
  getTopReviews,
} from "@/lib/services";

// ISR: প্রতি ৫ মিনিটে পেজ নতুন করে তৈরি হয় (দুই ভাষার জন্যই আগে থেকে বানানো)
export const revalidate = 300;

const gap = "mt-14 sm:mt-20";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const [dict, banners, categories, featured, newest, best, onSale, reviews] =
    await Promise.all([
      getDictionary(locale),
      getBanners(),
      getCategories(),
      getFeaturedProducts(4),
      getNewArrivals(8),
      getBestSellers(8),
      getProducts({ onSale: true, sort: "popular", pageSize: 8 }),
      getTopReviews(3),
    ]);

  const maxDiscount = Math.max(
    0,
    ...onSale.items.map((p) => discountPercent(p.price, p.comparePrice)),
  );

  return (
    <div className={`${containerCls} pb-4 pt-4 sm:pt-6`}>
      <HeroCarousel banners={banners} />

      <div className="mt-6">
        <FeaturesStrip dict={dict} />
      </div>

      <section className={gap}>
        <SectionHeading
          title={dict.home.categoriesTitle}
          subtitle={dict.home.categoriesSubtitle}
          href="/categories"
          linkLabel={dict.home.viewAll}
        />
        <CategoryGrid categories={categories} dict={dict} locale={locale} />
      </section>

      <section className={gap}>
        <SectionHeading
          title={dict.home.featuredTitle}
          subtitle={dict.home.featuredSubtitle}
          href="/products"
          linkLabel={dict.home.viewAll}
        />
        <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-5 sm:overflow-visible sm:px-0 lg:grid-cols-4">
          {featured.map((p, i) => (
            <div key={p.id} className="w-[46%] shrink-0 snap-start sm:w-auto">
              <ProductCard product={p} priority={i < 2} />
            </div>
          ))}
        </div>
      </section>

      {maxDiscount > 0 && (
        <div className={gap}>
          <PromoBanner
            dict={dict}
            locale={locale}
            percent={maxDiscount}
            image={onSale.items[0]?.images[0]}
          />
        </div>
      )}

      <section className={gap}>
        <ProductTabs
          tabs={[
            { key: "new", products: newest },
            { key: "best", products: best },
            { key: "sale", products: onSale.items },
          ]}
        />
      </section>

      {reviews.length > 0 && (
        <section className={gap}>
          <SectionHeading
            title={dict.home.reviewsTitle}
            subtitle={dict.home.reviewsSubtitle}
          />
          <ReviewsSection reviews={reviews} dict={dict} />
        </section>
      )}
    </div>
  );
}
