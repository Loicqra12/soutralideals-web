"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchPrestationStats,
  fetchPrestationsByPrestataire,
} from "@/lib/api/prestations";
import { useMyPrestataire } from "./useMyPrestataire";

export function usePrestataireDashboard() {
  const profileQuery = useMyPrestataire();
  const prestataireId = profileQuery.data?._id;

  const statsQuery = useQuery({
    queryKey: ["prestataire-stats", prestataireId],
    queryFn: () => fetchPrestationStats(prestataireId!),
    enabled: !!prestataireId,
    staleTime: 30_000,
  });

  const missionsQuery = useQuery({
    queryKey: ["prestataire-missions", prestataireId],
    queryFn: () =>
      fetchPrestationsByPrestataire(prestataireId!, { limit: 8 }),
    enabled: !!prestataireId,
    staleTime: 30_000,
  });

  return {
    profile: profileQuery.data,
    profileLoading: profileQuery.isLoading,
    profileError: profileQuery.error,
    stats: statsQuery.data,
    statsLoading: statsQuery.isLoading,
    missions: missionsQuery.data?.prestations ?? [],
    missionsTotal: missionsQuery.data?.total ?? 0,
    missionsLoading: missionsQuery.isLoading,
    refetch: () => {
      profileQuery.refetch();
      statsQuery.refetch();
      missionsQuery.refetch();
    },
  };
}
