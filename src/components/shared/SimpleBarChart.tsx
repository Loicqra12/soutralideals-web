"use client";

import { cn } from "@/lib/utils";

export interface BarChartItem {
  label: string;
  value: number;
}

export function SimpleBarChart({
  data,
  valueFormatter,
  className,
  barClassName,
}: {
  data: BarChartItem[];
  valueFormatter?: (v: number) => string;
  className?: string;
  barClassName?: string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const fmt = valueFormatter ?? ((v: number) => String(v));

  if (data.every((d) => d.value === 0)) {
    return (
      <p className="py-6 text-center text-sm text-neutral-400">
        Pas encore de données pour cette période.
      </p>
    );
  }

  return (
    <div className={cn("flex items-end justify-between gap-2", className)}>
      {data.map((item) => {
        const height = Math.max(8, (item.value / max) * 100);
        return (
          <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
            <span className="text-[10px] font-medium text-neutral-500">
              {item.value > 0 ? fmt(item.value) : ""}
            </span>
            <div className="flex h-28 w-full items-end">
              <div
                className={cn(
                  "w-full rounded-t-md bg-primary-500/80 transition-all duration-500",
                  barClassName,
                )}
                style={{ height: `${height}%` }}
                title={`${item.label}: ${fmt(item.value)}`}
              />
            </div>
            <span className="text-[10px] text-neutral-400">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}
