"use client";

import Link from "next/link";
import { ShieldCheck, Star, MapPin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Prestataire } from "@/types";
import { getServiceLabel, getCategoryLabel } from "@/lib/utils/listingDisplay";
import { resolveMediaUrl } from "@/lib/utils/mediaUrl";
import { useAuthStore } from "@/stores";
import { ProIcon } from "./ProIcon";

interface WelcomeHeaderProps {
  profile: Prestataire | null | undefined;
  missionsTotal: number;
  isVisible: boolean;
}

export function WelcomeHeader({
  profile,
  missionsTotal,
  isVisible,
}: WelcomeHeaderProps) {
  const utilisateur = useAuthStore((s) => s.utilisateur);
  const prenom = utilisateur?.prenom ?? profile?.prenom ?? "";
  const nom = utilisateur?.nom ?? profile?.nom ?? "";
  const initials = `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase() || "?";
  const photo =
    resolveMediaUrl(profile?.selfie ?? profile?.photoProfil) ??
    utilisateur?.photoProfil;
  const service = getServiceLabel(profile?.service);
  const categorie = getCategoryLabel(profile?.categorie, profile?.service);
  const ville = profile?.ville ?? profile?.localisation;

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
      <div className="border-b border-neutral-100 px-6 py-6 sm:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 border border-neutral-200">
              <AvatarImage src={photo ?? undefined} alt={`${prenom} ${nom}`} />
              <AvatarFallback className="bg-neutral-100 text-base text-neutral-700">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                Espace prestataire
              </p>
              <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
                Bonjour, {prenom || "prestataire"}
              </h1>
              <p className="mt-1 text-sm text-neutral-600">
                {service ?? "Prestataire"}
                {categorie ? ` · ${categorie}` : ""}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {profile?.verifier ? (
              <Badge variant="outline" className="gap-1 border-neutral-300 text-neutral-800">
                <ProIcon icon={ShieldCheck} size={14} />
                Profil vérifié
              </Badge>
            ) : (
              <Badge variant="outline" className="border-neutral-300 text-neutral-600">
                En attente de vérification
              </Badge>
            )}
            {ville && (
              <Badge variant="outline" className="gap-1 border-neutral-300 text-neutral-700">
                <ProIcon icon={MapPin} size={14} />
                {ville}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-3">
        <StatMini label="Missions totales" value={String(missionsTotal)} />
        <StatMini
          label="Note moyenne"
          value={profile?.note ? `${profile.note.toFixed(1)}` : "—"}
          icon={<ProIcon icon={Star} size={16} />}
        />
        <StatMini
          label="Visibilité"
          value={isVisible ? "Visible" : "Limitée"}
        />
      </div>

      {!isVisible && (
        <div className="border-t border-neutral-200 bg-neutral-50 px-6 py-3 text-sm text-neutral-700 sm:px-8">
          Complétez votre profil pour apparaître auprès des clients.{" "}
          <Link
            href="/profile"
            className="font-medium text-neutral-900 underline underline-offset-2"
          >
            Compléter mon profil
          </Link>
        </div>
      )}
    </div>
  );
}

function StatMini({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="border-t border-neutral-100 px-6 py-4 first:border-t-0 sm:border-t-0 sm:border-l sm:first:border-l-0">
      <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
        {label}
      </p>
      <p className="mt-1 flex items-center gap-1.5 text-xl font-semibold text-neutral-900">
        {icon}
        {value}
      </p>
    </div>
  );
}
