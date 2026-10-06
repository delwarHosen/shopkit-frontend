"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useLocale } from "./I18nProvider";
import { localizePath } from "./i18n-utils";

type Props = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

/** href এ নিজে থেকে বর্তমান ভাষা বসায়: <LocaleLink href="/products" /> */
export function LocaleLink({ href, ...props }: Props) {
  const locale = useLocale();
  return <Link href={localizePath(locale, href)} {...props} />;
}
