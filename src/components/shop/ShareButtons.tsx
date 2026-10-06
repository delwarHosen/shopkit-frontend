"use client";

import { Check, Facebook, Link2, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useDictionary } from "@/i18n/I18nProvider";

export function ShareButtons({ title }: { title: string }) {
  const dict = useDictionary();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  const open = (url: string) =>
    window.open(url, "_blank", "noopener,noreferrer");
  const pageUrl = () => window.location.href.split("#")[0];
  const btn =
    "inline-flex h-9 items-center gap-1.5 rounded-full border border-border px-3 text-sm transition-colors hover:border-primary hover:text-primary";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-muted-foreground">
        {dict.detail.share}:
      </span>
      <button
        type="button"
        className={btn}
        onClick={() =>
          open(
            `https://wa.me/?text=${encodeURIComponent(`${title} ${pageUrl()}`)}`,
          )
        }
      >
        <MessageCircle className="size-4" /> WhatsApp
      </button>
      <button
        type="button"
        className={btn}
        onClick={() =>
          open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl())}`,
          )
        }
      >
        <Facebook className="size-4" /> Facebook
      </button>
      <button
        type="button"
        className={btn}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(pageUrl());
            setCopied(true);
          } catch {}
        }}
      >
        {copied ? (
          <Check className="size-4 text-primary" />
        ) : (
          <Link2 className="size-4" />
        )}
        {copied ? dict.detail.copied : dict.detail.copyLink}
      </button>
    </div>
  );
}
