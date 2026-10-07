import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { containerCls } from "@/components/layout/styles";
import { Suspense } from "react";
import { TrackOrder } from "@/components/orders/TrackOrder";
import { Breadcrumbs } from "@/components/shop/Breadcrumbs";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  // ব্যক্তিগত/কাজের পেজ সার্চ ইঞ্জিনে ইনডেক্স হবে না
  return { title: dict.track.title, robots: { index: false, follow: false } };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <div className={`${containerCls} py-6 sm:py-10`}>
      <Breadcrumbs
        locale={locale}
        items={[
          { label: dict.listing.home, href: "/" },
          { label: dict.track.title },
        ]}
      />
      <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
        {dict.track.title}
      </h1>
      <p className="mt-1 mb-8 text-muted-foreground">{dict.track.subtitle}</p>
      {/* useSearchParams ব্যবহারের জন্য Suspense লাগে, তাতে বাকি পেজ স্ট্যাটিক থাকে */}
      <Suspense
        fallback={
          <div className="h-48 animate-pulse rounded-(--radius) bg-muted" />
        }
      >
        <TrackOrder />
      </Suspense>
    </div>
  );
}
