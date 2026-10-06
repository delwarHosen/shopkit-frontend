import { clientConfig } from "@/config/client";
import type { Locale } from "@/i18n/config";

export function AnnouncementBar({ locale }: { locale: Locale }) {
  return (
    <div className="bg-primary px-4 py-2 text-center text-xs font-medium text-primary-foreground sm:text-sm">
      {clientConfig.announcement[locale]}
    </div>
  );
}
