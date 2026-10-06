"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useLocale } from "@/i18n/I18nProvider";
import { localizePath } from "@/i18n/i18n-utils";
import { buildHref, type Patch } from "@/lib/product-query";

/** ফিল্টার/সর্ট বদলালে URL বদলায় (পেজ রিলোড ছাড়া, স্ক্রল জায়গায় থাকে) */
export function useListingNav(
  basePath: string,
  current: Record<string, string>,
) {
  const router = useRouter();
  const locale = useLocale();
  const [pending, start] = useTransition();

  const navigate = (patch: Patch) =>
    start(() =>
      router.push(localizePath(locale, buildHref(basePath, current, patch)), {
        scroll: false,
      }),
    );

  return { navigate, pending };
}
