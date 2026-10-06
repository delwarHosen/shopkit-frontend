import { containerCls } from "@/components/layout/styles";

const bar = "animate-pulse rounded-md bg-muted";

export function DetailSkeleton() {
  return (
    <div className={`${containerCls} py-6 sm:py-10`} aria-busy>
      <div className={`${bar} h-4 w-56`} />
      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div>
          <div className={`${bar} aspect-4/5 rounded-(--radius)`} />
          <div className="mt-3 flex gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className={`${bar} size-16 sm:size-20`} />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className={`${bar} h-4 w-24`} />
          <div className={`${bar} h-9 w-4/5`} />
          <div className={`${bar} h-4 w-40`} />
          <div className={`${bar} h-10 w-48`} />
          <div className={`${bar} mt-6 h-11 w-2/3`} />
          <div className={`${bar} h-12 w-full`} />
        </div>
      </div>
    </div>
  );
}
