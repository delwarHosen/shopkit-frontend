import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Youtube,
} from "lucide-react";
import { clientConfig } from "@/config/client";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/bn";
import { LocaleLink } from "@/i18n/LocaleLink";
import { Logo } from "./Logo";
import { NewsletterForm } from "./NewsletterForm";
import { containerCls } from "./styles";

const colTitle = "mb-3 text-sm font-semibold";
const linkCls =
  "text-sm text-muted-foreground transition-colors hover:text-foreground";

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { social, contact, features } = clientConfig;
  const socials = [
    { href: social.facebook, label: "Facebook", Icon: Facebook },
    { href: social.instagram, label: "Instagram", Icon: Instagram },
    { href: social.youtube, label: "YouTube", Icon: Youtube },
    { href: social.whatsapp, label: "WhatsApp", Icon: MessageCircle },
  ].filter((s) => s.href);

  const payments = (["bkash", "nagad", "cod", "card"] as const).filter(
    (m) => features[m],
  );

  return (
    <footer className="mt-16 border-t border-border bg-muted/40">
      {/* নিউজলেটার */}
      <div className="border-b border-border">
        <div
          className={`${containerCls} flex flex-col gap-4 py-8 md:flex-row md:items-center md:justify-between`}
        >
          <div>
            <h2 className="text-lg font-semibold">
              {dict.footer.newsletterTitle}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {dict.footer.newsletterText}
            </p>
          </div>
          <NewsletterForm />
        </div>
      </div>

      <div
        className={`${containerCls} grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4`}
      >
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm text-muted-foreground">
            {clientConfig.tagline[locale]}
          </p>
          {socials.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                {dict.footer.follow}
              </p>
              <div className="flex gap-2">
                {socials.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="grid size-9 place-items-center rounded-full border border-border transition-colors hover:border-primary hover:text-primary"
                  >
                    <Icon className="size-4" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <h3 className={colTitle}>{dict.footer.shop}</h3>
          <ul className="space-y-2">
            <li>
              <LocaleLink href="/products" className={linkCls}>
                {dict.nav.shop}
              </LocaleLink>
            </li>
            <li>
              <LocaleLink href="/categories" className={linkCls}>
                {dict.nav.categories}
              </LocaleLink>
            </li>
            <li>
              <LocaleLink href="/offers" className={linkCls}>
                {dict.nav.offers}
              </LocaleLink>
            </li>
            <li>
              <LocaleLink href="/track-order" className={linkCls}>
                {dict.nav.track}
              </LocaleLink>
            </li>
          </ul>
        </div>

        <div>
          <h3 className={colTitle}>{dict.footer.help}</h3>
          <ul className="space-y-2">
            <li>
              <LocaleLink href="/about" className={linkCls}>
                {dict.footer.about}
              </LocaleLink>
            </li>
            <li>
              <LocaleLink href="/returns" className={linkCls}>
                {dict.footer.returns}
              </LocaleLink>
            </li>
            <li>
              <LocaleLink href="/faq" className={linkCls}>
                {dict.footer.faq}
              </LocaleLink>
            </li>
            <li>
              <LocaleLink href="/privacy" className={linkCls}>
                {dict.footer.privacy}
              </LocaleLink>
            </li>
            <li>
              <LocaleLink href="/terms" className={linkCls}>
                {dict.footer.terms}
              </LocaleLink>
            </li>
          </ul>
        </div>

        <div>
          <h3 className={colTitle}>{dict.footer.contact}</h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 size-4 shrink-0" />
              <a
                href={`tel:${contact.phone}`}
                className="hover:text-foreground"
                dir="ltr"
              >
                {contact.phone}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 size-4 shrink-0" />
              <a
                href={`mailto:${contact.email}`}
                className="hover:text-foreground"
              >
                {contact.email}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0" />
              <span>
                {contact.address[locale]}
                <br />
                {contact.hours[locale]}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div
          className={`${containerCls} flex flex-col items-center justify-between gap-4 py-5 text-xs text-muted-foreground sm:flex-row`}
        >
          <p>
            © {new Date().getFullYear()} {clientConfig.name[locale]}.{" "}
            {dict.footer.rights}।
          </p>
          {payments.length > 0 && (
            <div
              className="flex flex-wrap items-center justify-center gap-2"
              aria-label={dict.footer.payments}
            >
              {payments.map((m) => (
                <span
                  key={m}
                  className="rounded-md border border-border bg-background px-2.5 py-1 font-medium text-foreground"
                >
                  {dict.footer.methods[m]}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
