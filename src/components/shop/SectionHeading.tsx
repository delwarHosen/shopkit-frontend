import { ArrowRight } from "lucide-react";
import { LocaleLink } from "@/i18n/LocaleLink";

type Props = {
  title: string;
  subtitle?: string;
  href?: string;
  linkLabel?: string;
};

export function SectionHeading({ title, subtitle, href, linkLabel }: Props) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            {subtitle}
          </p>
        )}
      </div>
      {href && linkLabel && (
        <LocaleLink
          href={href}
          className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          {linkLabel}
          <ArrowRight className="size-4 rtl:rotate-180" />
        </LocaleLink>
      )}
    </div>
  );
}
