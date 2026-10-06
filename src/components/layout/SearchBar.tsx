"use client";

import { Loader2, Search } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useDictionary, useLocale } from "@/i18n/I18nProvider";
import { localizePath } from "@/i18n/i18n-utils";
import { LocaleLink } from "@/i18n/LocaleLink";
import { formatPrice } from "@/lib/format";
import { useGetSearchSuggestionsQuery } from "@/store/api/hooks";

type Props = {
  className?: string;
  autoFocus?: boolean;
  onNavigate?: () => void;
};

export function SearchBar({ className = "", autoFocus, onNavigate }: Props) {
  const dict = useDictionary();
  const locale = useLocale();
  const router = useRouter();
  const wrapRef = useRef<HTMLDivElement>(null);

  const [value, setValue] = useState("");
  const [debounced, setDebounced] = useState("");
  const [open, setOpen] = useState(false);

  // টাইপ থামার ২৫০ms পরে সার্চ
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value.trim()), 250);
    return () => clearTimeout(t);
  }, [value]);

  // বাইরে ক্লিক করলে ড্রপডাউন বন্ধ
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const { data, isFetching } = useGetSearchSuggestionsQuery(debounced, {
    skip: debounced.length < 1,
  });
  const showPanel = open && debounced.length > 0;

  function submit(e: FormEvent) {
    e.preventDefault();
    const q = value.trim();
    if (!q) return;
    setOpen(false);
    onNavigate?.();
    router.push(
      `${localizePath(locale, "/products")}?q=${encodeURIComponent(q)}`,
    );
  }

  function pick() {
    setOpen(false);
    onNavigate?.();
  }

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <form onSubmit={submit} role="search" className="relative">
        <Search
          className="pointer-events-none absolute inset-s-0 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <input
          type="search"
          value={value}
          autoFocus={autoFocus}
          onChange={(e) => {
            setValue(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
          placeholder={dict.search.placeholder}
          aria-label={dict.search.placeholder}
          className="h-10 w-full rounded-full border border-border bg-muted ps-9 pe-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
        />
        {isFetching && (
          <Loader2
            className="absolute inset-e-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground"
            aria-hidden
          />
        )}
      </form>

      {showPanel && (
        <div className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-(--radius) border border-border bg-background shadow-lg">
          {data && data.length > 0 ? (
            <>
              <ul>
                {data.map((p) => (
                  <li key={p.id}>
                    <LocaleLink
                      href={`/products/${p.slug}`}
                      onClick={pick}
                      className="flex items-center gap-3 px-3 py-2 transition-colors hover:bg-muted"
                    >
                      <Image
                        src={p.images[0]}
                        alt=""
                        width={40}
                        height={40}
                        className="size-10 rounded-md object-cover"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">
                          {p.name}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          {formatPrice(p.price, locale)}
                        </span>
                      </span>
                    </LocaleLink>
                  </li>
                ))}
              </ul>
              <LocaleLink
                href={`/products?q=${encodeURIComponent(debounced)}`}
                onClick={pick}
                className="block border-t border-border px-3 py-2.5 text-center text-sm font-medium text-primary hover:bg-muted"
              >
                {dict.search.viewAll}
              </LocaleLink>
            </>
          ) : (
            !isFetching && (
              <p className="px-3 py-4 text-center text-sm text-muted-foreground">
                {dict.search.noResults}
              </p>
            )
          )}
        </div>
      )}
    </div>
  );
}
