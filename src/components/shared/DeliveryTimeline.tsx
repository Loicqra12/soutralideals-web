"use client";

import { Check, Circle, Package, Truck, Home, X } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { key: "En cours", label: "Commande reçue", icon: Circle },
  { key: "Confirmée", label: "Confirmée", icon: Check },
  { key: "En préparation", label: "En préparation", icon: Package },
  { key: "Expédiée", label: "Expédiée", icon: Truck },
  { key: "Livrée", label: "Livrée", icon: Home },
] as const;

function getStepIndex(status: string): number {
  if (status === "Annulée") return -1;
  const idx = STEPS.findIndex((s) => s.key === status);
  return idx >= 0 ? idx : 0;
}

export function DeliveryTimeline({ status }: { status: string }) {
  if (status === "Annulée") {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
        <X className="h-5 w-5 text-red-500" />
        <div>
          <p className="text-sm font-semibold text-red-700">Commande annulée</p>
          <p className="text-xs text-red-500">Cette commande ne sera pas livrée.</p>
        </div>
      </div>
    );
  }

  const currentIdx = getStepIndex(status);

  return (
    <div className="px-2 py-4">
      <div className="relative flex justify-between">
        <div className="absolute left-4 right-4 top-4 h-0.5 bg-neutral-200" />
        <div
          className="absolute left-4 top-4 h-0.5 bg-emerald-500 transition-all duration-500"
          style={{
            width: currentIdx <= 0 ? "0%" : `${(currentIdx / (STEPS.length - 1)) * 100}%`,
            maxWidth: "calc(100% - 2rem)",
          }}
        />
        {STEPS.map((step, i) => {
          const done = i <= currentIdx;
          const active = i === currentIdx;
          const Icon = step.icon;
          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center gap-2">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors",
                  done
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : "border-neutral-200 bg-white text-neutral-300",
                  active && done && "ring-4 ring-emerald-100",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
              </div>
              <span
                className={cn(
                  "max-w-[4.5rem] text-center text-[10px] leading-tight sm:max-w-none sm:text-xs",
                  done ? "font-medium text-neutral-800" : "text-neutral-400",
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
