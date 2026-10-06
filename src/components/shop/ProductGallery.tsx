"use client";

import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useDictionary } from "@/i18n/I18nProvider";

type Props = { images: string[]; alt: string; badges?: React.ReactNode };

export function ProductGallery({ images, alt, badges }: Props) {
  const dict = useDictionary();
  const n = images.length;
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");

  const go = useCallback((i: number) => setIndex(((i % n) + n) % n), [n]);

  // লাইটবক্স: Esc, তীর কী, স্ক্রল বন্ধ
  useEffect(() => {
    if (!lightbox) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight") go(index + 1);
      if (e.key === "ArrowLeft") go(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox, index, go]);

  function onDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x < -50) go(index + 1);
    else if (info.offset.x > 50) go(index - 1);
  }

  const arrow =
    "absolute top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-background/85 text-foreground shadow-md backdrop-blur transition-colors hover:bg-background";

  return (
    <div role="group" aria-label={dict.detail.gallery}>
      <div
        className="relative aspect-4/5 cursor-zoom-in overflow-hidden rounded-(--radius) bg-muted"
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setOrigin(
            `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`,
          );
        }}
      >
        <AnimatePresence initial={false}>
          <motion.div
            key={index}
            className="absolute inset-0 touch-pan-y"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={onDragEnd}
            onTap={() => setLightbox(true)}
          >
            <Image
              src={images[index]}
              alt={`${alt} ${index + 1}`}
              fill
              priority={index === 0}
              sizes="(min-width: 1024px) 50vw, 100vw"
              draggable={false}
              className="object-cover transition-transform duration-200"
              style={{
                transformOrigin: origin,
                transform: zoom ? "scale(1.8)" : "scale(1)",
              }}
            />
          </motion.div>
        </AnimatePresence>

        {badges && (
          <div className="pointer-events-none absolute start-3 top-3 z-10 flex flex-col items-start gap-1.5">
            {badges}
          </div>
        )}

        <button
          type="button"
          onClick={() => setLightbox(true)}
          aria-label={dict.detail.zoom}
          className="absolute bottom-3 end-3 z-10 grid size-10 place-items-center rounded-full bg-background/85 shadow-md backdrop-blur"
        >
          <ZoomIn className="size-5" />
        </button>

        {n > 1 && (
          <>
            <button
              type="button"
              aria-label={dict.detail.prevImage}
              onClick={() => go(index - 1)}
              className={`${arrow} start-3 hidden md:grid`}
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              aria-label={dict.detail.nextImage}
              onClick={() => go(index + 1)}
              className={`${arrow} end-3 hidden md:grid`}
            >
              <ChevronRight className="size-5" />
            </button>
            <div className="absolute inset-x-0 bottom-3 z-10 flex justify-center gap-1.5 md:hidden">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${i === index ? "w-5 bg-white" : "w-1.5 bg-white/60"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {n > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => go(i)}
              aria-label={`${dict.detail.image} ${i + 1}`}
              aria-current={i === index}
              className={`relative size-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors sm:size-20 ${
                i === index
                  ? "border-primary"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-[70] bg-black/92"
            role="dialog"
            aria-modal="true"
            aria-label={alt}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(false)}
          >
            <button
              type="button"
              aria-label={dict.detail.closeZoom}
              onClick={() => setLightbox(false)}
              className="absolute end-4 top-[max(1rem,env(safe-area-inset-top))] z-10 grid size-11 place-items-center rounded-full bg-white/15 text-white hover:bg-white/25"
            >
              <X className="size-6" />
            </button>
            <div
              className="absolute inset-0 p-4 sm:p-12"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative size-full">
                <Image
                  src={images[index]}
                  alt={`${alt} ${index + 1}`}
                  fill
                  sizes="100vw"
                  className="object-contain"
                />
              </div>
            </div>
            {n > 1 && (
              <>
                <button
                  type="button"
                  aria-label={dict.detail.prevImage}
                  onClick={(e) => {
                    e.stopPropagation();
                    go(index - 1);
                  }}
                  className="absolute start-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white hover:bg-white/25"
                >
                  <ChevronLeft className="size-6" />
                </button>
                <button
                  type="button"
                  aria-label={dict.detail.nextImage}
                  onClick={(e) => {
                    e.stopPropagation();
                    go(index + 1);
                  }}
                  className="absolute end-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white hover:bg-white/25"
                >
                  <ChevronRight className="size-6" />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
