"use client";

import Link from "next/link";
import { CheckCircle2, Circle, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ProfileCheckItem } from "@/lib/utils/prestataireDashboard";
import { ProIcon } from "./ProIcon";

interface ProfileStrengthCardProps {
  score: number;
  total: number;
  percent: number;
  items: ProfileCheckItem[];
  isVisible: boolean;
}

export function ProfileStrengthCard({
  score,
  total,
  percent,
  items,
  isVisible,
}: ProfileStrengthCardProps) {
  const pending = items.filter((i) => !i.done);

  const itemHref = (id: string) => {
    if (id === "cni" || id === "selfie" || id === "gps") {
      return "/prestataire/finalisation";
    }
    if (id === "service" || id === "ville") {
      return "/prestataire/profil";
    }
    return "/prestataire/dashboard";
  };

  return (
    <Card className="border-neutral-200 shadow-none">
      <CardHeader className="border-b border-neutral-100 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-base font-semibold text-neutral-900">
              Force du profil
            </CardTitle>
            <p className="mt-1 text-sm text-neutral-500">
              {isVisible
                ? "Votre profil est visible pour les clients."
                : "Complétez votre profil pour être visible."}
            </p>
          </div>
          <p className="text-xl font-semibold text-neutral-900">
            {score}
            <span className="text-sm font-normal text-neutral-400">/{total}</span>
          </p>
        </div>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-neutral-200">
          <div
            className="h-full rounded-full bg-primary-700 transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-2 p-4">
        {pending.length === 0 ? (
          <div className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
            <ProIcon icon={CheckCircle2} size={18} />
            Votre profil est complet.
          </div>
        ) : (
          pending.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-neutral-100 px-4 py-3"
            >
              <div className="flex items-start gap-3">
                <ProIcon icon={Circle} size={16} className="mt-0.5 text-neutral-400" />
                <div>
                  <p className="text-sm font-medium text-neutral-900">
                    {item.label}
                  </p>
                  {item.hint && (
                    <p className="text-xs text-neutral-500">{item.hint}</p>
                  )}
                </div>
              </div>
              <Button variant="outline" size="sm" asChild className="shrink-0 border-neutral-300">
                <Link href={itemHref(item.id)}>
                  Compléter
                  <ProIcon icon={ChevronRight} size={14} className="ml-1" />
                </Link>
              </Button>
            </div>
          ))
        )}
        {pending.length > 3 && (
          <p className="text-center text-xs text-neutral-500">
            + {pending.length - 3} autre{pending.length - 3 > 1 ? "s" : ""}{" "}
            étape{pending.length - 3 > 1 ? "s" : ""}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
