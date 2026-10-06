import { ChevronRight } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { localizePath } from "@/i18n/i18n-utils";
import { LocaleLink } from "@/i18n/LocaleLink";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({
  items,
  locale,
}: {
  items: Crumb[];
  locale: Locale;
}) {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: site + localizePath(locale, c.href) } : {}),
    })),
  };

  return (
    <>
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          {items.map((c, i) => {
            const last = i === items.length - 1;
            return (
              <li key={c.label} className="flex items-center gap-1.5">
                {c.href && !last ? (
                  <LocaleLink href={c.href} className="hover:text-foreground">
                    {c.label}
                  </LocaleLink>
                ) : (
                  <span
                    aria-current={last ? "page" : undefined}
                    className={last ? "text-foreground" : ""}
                  >
                    {c.label}
                  </span>
                )}
                {!last && <ChevronRight className="size-3.5 rtl:rotate-180" />}
              </li>
            );
          })}
        </ol>
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
