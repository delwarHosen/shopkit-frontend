"use client";

import { Check, X } from "lucide-react";
import { useDictionary, useLocale } from "@/i18n/I18nProvider";
import { formatDateTime } from "@/lib/format";
import type { Order, OrderStatus } from "@/types/shop";

const FLOW: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
];

export function OrderTimeline({ order }: { order: Order }) {
  const dict = useDictionary();
  const locale = useLocale();
  const abnormal = order.status === "cancelled" || order.status === "returned";
  const at = (s: OrderStatus) => order.timeline.find((e) => e.status === s)?.at;

  // বাতিল/ফেরত: যা যা ঘটেছে সেই ইতিহাস
  if (abnormal) {
    return (
      <ol className="space-y-4">
        {order.timeline.map((e, i) => {
          const bad = e.status === "cancelled" || e.status === "returned";
          return (
            <li key={`${e.status}-${i}`} className="flex items-start gap-3">
              <span
                className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-full ${bad ? "bg-rose-500 text-white" : "bg-primary text-primary-foreground"}`}
              >
                {bad ? (
                  <X className="size-3.5" />
                ) : (
                  <Check className="size-3.5" />
                )}
              </span>
              <div>
                <p className="text-sm font-medium">
                  {dict.orderStatus[e.status]}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDateTime(e.at, locale)}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    );
  }

  const current = FLOW.indexOf(order.status);

  return (
    <ol>
      {FLOW.map((s, i) => {
        const done = i < current;
        const active = i === current;
        const time = at(s);
        return (
          <li key={s} className="relative flex gap-3 pb-6 last:pb-0">
            {i < FLOW.length - 1 && (
              <span
                className={`absolute start-3 top-6 -ms-px h-[calc(100%-1.5rem)] w-0.5 ${done ? "bg-primary" : "bg-border"}`}
                aria-hidden
              />
            )}
            <span
              className={`relative z-10 grid size-6 shrink-0 place-items-center rounded-full text-xs ${
                done
                  ? "bg-primary text-primary-foreground"
                  : active
                    ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                    : "border-2 border-border bg-background"
              }`}
            >
              {(done || active) && <Check className="size-3.5" />}
            </span>
            <div className="-mt-0.5">
              <p
                className={`text-sm ${active ? "font-semibold" : done ? "font-medium" : "text-muted-foreground"}`}
              >
                {dict.orderStatus[s]}
              </p>
              {time && (
                <p className="text-xs text-muted-foreground">
                  {formatDateTime(time, locale)}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
