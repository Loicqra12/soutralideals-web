"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MissionRow,
  MissionEmptyState,
} from "@/components/prestataire/MissionRow";
import { useMyPrestataire } from "@/lib/hooks/useMyPrestataire";
import { useQuery } from "@tanstack/react-query";
import { fetchPrestationsByPrestataire } from "@/lib/api/prestations";
import { STATUT_LABELS } from "@/lib/utils/prestataireDashboard";

const FILTERS = [
  { value: "all", label: "Toutes" },
  { value: "EN_ATTENTE", label: "En attente" },
  { value: "ACCEPTEE", label: "Acceptées" },
  { value: "EN_COURS", label: "En cours" },
  { value: "TERMINEE", label: "Terminées" },
] as const;

export default function PrestataireMissionsPage() {
  const [filter, setFilter] = useState<string>("all");
  const { data: profile, isLoading: profileLoading } = useMyPrestataire();

  const { data, isLoading } = useQuery({
    queryKey: ["prestataire-missions-all", profile?._id, filter],
    queryFn: () =>
      fetchPrestationsByPrestataire(profile!._id, {
        limit: 50,
        statut: filter === "all" ? undefined : filter,
      }),
    enabled: !!profile?._id,
  });

  const missions = data?.prestations ?? [];
  const total = data?.total ?? 0;

  if (profileLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
        <div className="h-64 animate-pulse rounded-xl bg-neutral-200" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 lg:px-8 lg:py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Mes missions</h1>
        <p className="mt-1 text-neutral-600">
          Gérez les demandes de prestation de vos clients
        </p>
      </div>

      <Tabs value={filter} onValueChange={setFilter} className="mb-6">
        <TabsList className="h-auto flex-wrap gap-1 bg-neutral-100 p-1">
          {FILTERS.map((f) => (
            <TabsTrigger
              key={f.value}
              value={f.value}
              className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              {f.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Card className="border-neutral-200 shadow-sm">
        <CardHeader className="border-b border-neutral-100">
          <CardTitle className="text-base font-medium text-neutral-600">
            {total} mission{total !== 1 ? "s" : ""}
            {filter !== "all" && (
              <span className="text-neutral-400">
                {" "}
                · {STATUT_LABELS[filter]}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-20 animate-pulse rounded-lg bg-neutral-100"
                />
              ))}
            </div>
          ) : missions.length === 0 ? (
            <MissionEmptyState />
          ) : (
            missions.map((m) => (
              <MissionRow
                key={m._id}
                mission={m}
                showActions
                prestataireId={profile?._id}
              />
            ))
          )}
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-sm text-neutral-500">
        <Link
          href="/prestataire/dashboard"
          className="text-neutral-900 underline underline-offset-2"
        >
          ← Retour au tableau de bord
        </Link>
      </p>
    </div>
  );
}
