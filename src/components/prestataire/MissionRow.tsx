"use client";

import Link from "next/link";
import { MapPin, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Prestation } from "@/types/prestation";
import { getServiceLabel } from "@/lib/utils/listingDisplay";
import {
  STATUT_LABELS,
  STATUT_VARIANT,
} from "@/lib/utils/prestataireDashboard";
import { cn } from "@/lib/utils";
import { ProIcon, ProIconBox } from "./ProIcon";
import { MissionActions } from "./MissionActions";

function getClientName(p: Prestation): string {
  const u = p.utilisateur;
  if (!u) return "Client";
  const name = [u.prenom, u.nom].filter(Boolean).join(" ");
  return name || "Client";
}

function formatDate(date?: string): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function MissionRow({
  mission,
  className,
  showActions = false,
  prestataireId,
}: {
  mission: Prestation;
  className?: string;
  showActions?: boolean;
  prestataireId?: string;
}) {
  const statut = mission.statut ?? "EN_ATTENTE";
  const serviceName = getServiceLabel(mission.service) ?? "Service";

  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-b border-neutral-100 py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-medium text-neutral-900">{serviceName}</p>
          <Badge variant={STATUT_VARIANT[statut] ?? "outline"}>
            {STATUT_LABELS[statut] ?? statut}
          </Badge>
        </div>
        <p className="mt-1 text-sm text-neutral-600">{getClientName(mission)}</p>
        <div className="mt-2 flex flex-wrap gap-3 text-xs text-neutral-500">
          {mission.ville && (
            <span className="flex items-center gap-1">
              <ProIcon icon={MapPin} size={14} />
              {mission.ville}
            </span>
          )}
          <span className="flex items-center gap-1">
            <ProIcon icon={Calendar} size={14} />
            {formatDate(mission.datePrestation)}
          </span>
        </div>
      </div>
      {mission.description && (
        <p className="line-clamp-2 max-w-md text-sm text-neutral-500">
          {mission.description}
        </p>
      )}
      {showActions && (
        <MissionActions mission={mission} prestataireId={prestataireId} />
      )}
    </div>
  );
}

export function MissionEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-neutral-200 px-6 py-12 text-center">
      <ProIconBox className="h-12 w-12">
        <ProIcon icon={Calendar} size={22} />
      </ProIconBox>
      <h3 className="mt-4 text-base font-semibold text-neutral-900">
        Aucune mission pour le moment
      </h3>
      <p className="mt-2 max-w-sm text-sm text-neutral-500">
        Les demandes de devis des clients apparaîtront ici.
      </p>
      <Link
        href="/prestataires"
        className="mt-6 text-sm font-medium text-neutral-900 underline underline-offset-2"
      >
        Voir la vitrine prestataires
      </Link>
    </div>
  );
}
