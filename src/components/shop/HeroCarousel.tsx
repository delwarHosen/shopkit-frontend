"use client";

import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useDictionary } from "@/i18n/I18nProvider";
import { bannerText } from "@/i18n/i18n-utils";
import { LocaleLink } from "@/i18n/LocaleLink";
import type { Banner } from "@/types/shop";

const INTERVAL = 5500;

export function HeroCarousel({ banners }: { banners: Banner[] }) {
  const dict = useDictionary();
  const count = banners.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback((n: number) => setIndex((n + count) % count), [count]);

  // অটো-প্লে: মাউস/ফোকাস থাকলে বা reduced-motion চালু থাকলে থামে
  useEffect(() => {
    if (paused || count < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), INTERVAL);
    return () => clearInterval(t);
  }, [paused, count]);

  if (count === 0) return null;
  const banner = banners[index];
  const text = bannerText(dict, banner);

  function onDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x < -60) go(index + 1);
    else if (info.offset.x > 60) go(index - 1);
  }

  const arrow =
    "absolute top-1/2 z-10 hidden size-11 -translate-y-1/2 place-items-center rounded-full bg-background/80 text-foreground shadow-md backdrop-blur transition-colors hover:bg-background md:grid";

  return (
    <section
      aria-roledescription="carousel"
      aria-label={dict.home.heroLabel}
      className="relative h-105 overflow-hidden rounded-3xl bg-muted sm:h-120 lg:h-140"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={banner.id}
          className="absolute inset-0 touch-pan-y"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={onDragEnd}
          aria-roledescription="slide"
          aria-label={`${index + 1} / ${count}`}
        >
          <Image
            src={banner.image}
            alt=""
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover"
            draggable={false}
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/75 via-black/40 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="w-full px-6 sm:px-12 lg:px-16">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="max-w-xl text-white"
              >
                <h2 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                  {text.title}
                </h2>
                <p className="mt-3 text-base text-white/85 sm:text-lg">
                  {text.subtitle}
                </p>
                <LocaleLink
                  href={banner.href}
                  className="mt-6 inline-flex h-12 items-center rounded-full bg-primary px-7 font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
                >
                  {text.cta}
                </LocaleLink>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {count > 1 && (
        <>
          <button
            type="button"
            className={`${arrow} inset-s-4`}
            aria-label={dict.home.prev}
            onClick={() => go(index - 1)}
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            className={`${arrow} inset-e-4`}
            aria-label={dict.home.next}
            onClick={() => go(index + 1)}
          >
            <ChevronRight className="size-5" />
          </button>
          <div className="absolute inset-x-0 bottom-4 z-10 flex justify-center gap-2">
            {banners.map((b, i) => (
              <button
                key={b.id}
                type="button"
                aria-label={`${dict.home.goTo} ${i + 1}`}
                aria-current={i === index}
                onClick={() => go(i)}
                className={`h-2 rounded-full transition-all ${i === index ? "w-7 bg-white" : "w-2 bg-white/50 hover:bg-white/80"}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
