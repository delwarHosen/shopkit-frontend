import { notFound } from "next/navigation";
import { containerCls } from "@/components/layout/styles";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

// সেকশন ৪ এ আসল হোমপেজ দিয়ে বদলে যাবে
export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <section className={`${containerCls} py-16`}>
      <h1 className="text-3xl font-bold">{dict.home.title}</h1>
      <p className="mt-3 max-w-xl text-muted-foreground">{dict.home.text}</p>
      {/* স্ক্রল করে sticky হেডার ও বটম নেভ টেস্ট করার জন্য */}
      <div className="mt-10 h-[120vh] rounded-[var(--radius)] border border-dashed border-border" />
    </section>
  );
}