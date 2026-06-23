import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/** Icônes dashboard prestataire : noir, trait fin, style pro */
export const PRO_ICON = "text-neutral-900";
export const PRO_ICON_STROKE = 1.5;

export function ProIcon({
  icon: Icon,
  className,
  size = 20,
}: {
  icon: LucideIcon;
  className?: string;
  size?: number;
}) {
  return (
    <Icon
      className={cn(PRO_ICON, className)}
      size={size}
      strokeWidth={PRO_ICON_STROKE}
    />
  );
}

export function ProIconBox({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50",
        className,
      )}
    >
      {children}
    </div>
  );
}
