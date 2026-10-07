import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { containerCls } from "@/components/layout/styles";
import { Breadcrumbs } from "@/components/shop/Breadcrumbs";
import {
  ProductAccordion,
  productDescription,
} from "@/components/shop/ProductAccordion";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { PurchasePanel } from "@/components/shop/PurchasePanel";
import { ReviewsPanel } from "@/components/shop/ReviewsPanel";
import { SectionHeading } from "@/components/shop/SectionHeading";
import { ShareButtons } from "@/components/shop/ShareButtons";
import { Stars } from "@/components/shop/Stars";
import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import {
  categoryLabel,
  fill,
  localizePath,
  productLabel,
} from "@/i18n/i18n-utils";
import { discountPercent, formatNumber, formatPrice } from "@/lib/format";
import { brandLabel } from "@/lib/product-options";
import {
  getAllProductSlugs,
  getCategories,
  getProductBySlug,
  getRelatedProducts,
  getReviewsByProduct,
} from "@/lib/services";
import { WishlistButton } from "@/components/shop/WishlistButton";

type Props = { params: Promise<{ locale: string; slug: string }> };

// ISR: ১০ মিনিট পরপর নতুন করে তৈরি হয়
export const revalidate = 600;

// বিল্ডের সময় সব পণ্যের পেজ দুই ভাষায় আগে থেকে বানানো হয় (SSG)
export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const [dict, product] = await Promise.all([
    getDictionary(locale),
    getProductBySlug(slug),
  ]);
  if (!product) return {};
  const name = productLabel(dict, product);
  const description = productDescription(product, dict, locale, name);
  return {
    title: name,
    description,
    openGraph: {
      title: name,
      description,
      images: [{ url: product.images[0] }],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const [dict, product, categories] = await Promise.all([
    getDictionary(locale),
    getProductBySlug(slug),
    getCategories(),
  ]);
  if (!product) notFound();

  const [related, reviews] = await Promise.all([
    getRelatedProducts(product, 4),
    getReviewsByProduct(product.id),
  ]);

  const category = categories.find((c) => c.id === product.categoryId);
  const name = productLabel(dict, product);
  const discount = discountPercent(product.price, product.comparePrice);
  const saving = product.comparePrice
    ? product.comparePrice - product.price
    : 0;
  const soldOut = product.stock <= 0;
  const lowStock = !soldOut && product.stock <= 5;

  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    image: product.images,
    description: productDescription(product, dict, locale, name),
    sku: product.id,
    brand: { "@type": "Brand", name: brandLabel(dict, product.brand) },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
    offers: {
      "@type": "Offer",
      url: site + localizePath(locale, `/products/${slug}`),
      priceCurrency: "BDT",
      price: product.price,
      availability: soldOut
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
    },
  };

  const badge = "rounded-full px-2.5 py-1 text-xs font-semibold";

  return (
    <div className={`${containerCls} py-6 sm:py-10`}>
      <Breadcrumbs
        locale={locale}
        items={[
          { label: dict.listing.home, href: "/" },
          { label: dict.nav.categories, href: "/categories" },
          ...(category
            ? [
                {
                  label: categoryLabel(dict, category),
                  href: `/categories/${category.slug}`,
                },
              ]
            : []),
          { label: name },
        ]}
      />

      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="self-start lg:sticky lg:top-24">
          <ProductGallery
            images={product.images}
            alt={name}
            badges={
              <>
                {discount > 0 && (
                  <span className={`${badge} bg-rose-600 text-white`}>
                    -{formatNumber(discount, locale)}%
                  </span>
                )}
                {product.isNew && (
                  <span
                    className={`${badge} bg-primary text-primary-foreground`}
                  >
                    {dict.product.new}
                  </span>
                )}
              </>
            }
          />
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            {brandLabel(dict, product.brand)}
          </p>
          <div className="mt-1 flex items-start justify-between gap-3">
            <h1 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
              {name}
            </h1>
            <WishlistButton productId={product.id} variant="inline" />
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
            <a href="#reviews" className="hover:opacity-80">
              <Stars rating={product.rating} count={product.reviewCount} />
            </a>
            <span className="text-sm text-muted-foreground">
              {fill(dict.detail.sold, {
                n: formatNumber(product.sold, locale),
              })}
            </span>
          </div>

          <div className="mt-5 flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-bold">
              {formatPrice(product.price, locale)}
            </span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(product.comparePrice, locale)}
              </span>
            )}
          </div>
          {saving > 0 && (
            <p className="mt-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
              {fill(dict.detail.save, { amount: formatPrice(saving, locale) })}
            </p>
          )}

          <p
            className={`mt-3 text-sm font-medium ${
              soldOut
                ? "text-rose-600"
                : lowStock
                  ? "text-orange-600 dark:text-orange-400"
                  : "text-emerald-600 dark:text-emerald-400"
            }`}
          >
            {soldOut
              ? dict.detail.outOfStock
              : lowStock
                ? fill(dict.product.lowStock, {
                    n: formatNumber(product.stock, locale),
                  })
                : dict.detail.inStock}
          </p>

          <div className="mt-6 border-t border-border pt-6">
            <PurchasePanel product={product} />
          </div>

          <div className="mt-8">
            <ShareButtons title={name} />
          </div>

          <div className="mt-8">
            <ProductAccordion
              product={product}
              dict={dict}
              locale={locale}
              name={name}
            />
          </div>
        </div>
      </div>

      <section id="reviews" className="mt-16 scroll-mt-24 sm:mt-20">
        <SectionHeading title={dict.detail.reviews} />
        <ReviewsPanel
          product={product}
          reviews={reviews}
          dict={dict}
          locale={locale}
        />
      </section>

      {related.length > 0 && (
        <section className="mt-16 sm:mt-20">
          <SectionHeading title={dict.detail.related} />
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
    </div>
  );
}
