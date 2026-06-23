import { cn } from "@/lib/utils";

function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-neutral-200",
        className,
      )}
    />
  );
}

export function CardSkeletonGrid({
  count = 8,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className,
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border border-neutral-100 bg-white">
          <Shimmer className="aspect-[4/3] rounded-none" />
          <div className="space-y-3 p-4">
            <Shimmer className="h-4 w-3/4" />
            <Shimmer className="h-3 w-1/2" />
            <div className="flex gap-2 pt-1">
              <Shimmer className="h-3 w-16" />
              <Shimmer className="h-3 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ArticleSkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border border-neutral-100 bg-white">
          <Shimmer className="aspect-square rounded-none" />
          <div className="space-y-2 p-3">
            <Shimmer className="h-3 w-4/5" />
            <Shimmer className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
