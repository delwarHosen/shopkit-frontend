import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { containerCls } from "@/components/layout/styles";
import { LoginForm } from "@/components/account/LoginForm";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  // ব্যক্তিগত/কাজের পেজ সার্চ ইঞ্জিনে ইনডেক্স হবে না
  return { title: dict.login.title, robots: { index: false, follow: false } };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <div className={`${containerCls} py-10 sm:py-16`}>
      <LoginForm />
    </div>
  );
}
