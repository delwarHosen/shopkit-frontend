import { containerCls } from "@/components/layout/styles";

const bar = "animate-pulse rounded-md bg-muted";

export function ListingGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div>
      <div className={`${bar} mb-5 h-5 w-24`} />
      <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-5 xl:grid-cols-4">
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="space-y-3" aria-hidden>
            <div className={`${bar} aspect-4/5 rounded-(--radius)`} />
            <div className={`${bar} h-3 w-1/3`} />
            <div className={`${bar} h-4 w-4/5`} />
            <div className={`${bar} h-4 w-1/2`} />
          </div>
        ))}
      </div>
    </div>
  );
}

/** পুরো পেজের স্কেলিটন, loading.tsx এ ব্যবহার হয় */
export function ListingPageSkeleton() {
  return (
    <div className={`${containerCls} py-6 sm:py-10`} aria-busy>
      <div className={`${bar} h-4 w-40`} />
      <div className={`${bar} mt-4 h-9 w-64`} />
      <div className="mt-6 grid gap-8 lg:grid-cols-[260px_1fr]">
        <div className="hidden space-y-4 lg:block">
          <div className={`${bar} h-6 w-24`} />
          <div className={`${bar} h-40`} />
          <div className={`${bar} h-24`} />
        </div>
        <ListingGridSkeleton />
      </div>
    </div>
  );
}
