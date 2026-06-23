"use client";

import { useServicesByGroupe } from "@/lib/hooks/useServices";
import { POLE_GROUPE_NAMES } from "@/lib/utils/filters";
import { cn } from "@/lib/utils";

export function ServiceSelect({
  pole,
  value,
  onChange,
  className,
}: {
  pole: "metiers" | "freelance";
  value: string;
  onChange: (serviceId: string, serviceName: string) => void;
  className?: string;
}) {
  const groupe =
    pole === "metiers"
      ? POLE_GROUPE_NAMES.metiers
      : POLE_GROUPE_NAMES.freelance;
  const { data: services, isLoading } = useServicesByGroupe(groupe);

  if (isLoading) {
    return (
      <div className={cn("h-10 animate-pulse rounded-lg bg-neutral-100", className)} />
    );
  }

  return (
    <select
      value={value}
      onChange={(e) => {
        const id = e.target.value;
        const service = services?.find((s) => s._id === id);
        onChange(id, service?.nomservice ?? "");
      }}
      className={cn(
        "flex h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
        className,
      )}
      required
    >
      <option value="">Choisir un service</option>
      {(services ?? []).map((s) => (
        <option key={s._id} value={s._id}>
          {s.nomservice}
        </option>
      ))}
    </select>
  );
}
