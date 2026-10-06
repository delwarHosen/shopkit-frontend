import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Hind_Siliguri } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { clientConfig } from "@/config/client";
import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { I18nProvider } from "@/i18n/I18nProvider";
import { StoreProvider } from "@/store/StoreProvider";
import "../globals.css";

const bengali = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bengali",
});

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => locales.map((locale) => ({ locale }));

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover", // মোবাইলে safe-area (নচ/বটম বার) এর জন্য
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const name = clientConfig.name[locale];
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    title: { default: name, template: `%s | ${name}` },
    description: clientConfig.tagline[locale],
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  const themeVars = {
    "--primary": clientConfig.theme.primary,
    "--primary-foreground": clientConfig.theme.primaryForeground,
    "--radius": clientConfig.theme.radius,
  } as React.CSSProperties;

  return (
    <html lang={locale} className={bengali.variable} style={themeVars} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <StoreProvider>
          <ThemeProvider>
            <I18nProvider locale={locale} dict={dict}>
              {children}
            </I18nProvider>
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}