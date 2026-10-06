import {
  RotateCcw,
  ShieldCheck,
  Truck,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { clientConfig } from "@/config/client";
import type { Dictionary } from "@/i18n/dictionaries/bn";

export function FeaturesStrip({ dict }: { dict: Dictionary }) {
  const f = dict.home.features;
  const items: {
    key: string;
    Icon: LucideIcon;
    title: string;
    text: string;
  }[] = [
    { key: "delivery", Icon: Truck, ...f.delivery },
    ...(clientConfig.features.cod
      ? [{ key: "cod", Icon: Wallet, ...f.cod }]
      : []),
    { key: "returns", Icon: RotateCcw, ...f.returns },
    { key: "secure", Icon: ShieldCheck, ...f.secure },
  ];

  return (
    <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {items.map(({ key, Icon, title, text }) => (
        <li
          key={key}
          className="flex items-start gap-3 rounded-(--radius) border border-border p-4"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
            <Icon className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold">{title}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{text}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
