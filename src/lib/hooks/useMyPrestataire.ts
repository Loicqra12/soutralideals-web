"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchPrestataireById, fetchPrestataires } from "@/lib/api/prestataires";
import { useAuthStore } from "@/stores";
import type { Prestataire } from "@/types";

export function useMyPrestataire() {
  const utilisateur = useAuthStore((s) => s.utilisateur);
  const roleDetails = useAuthStore((s) => s.roleDetails);
  const prestataireId = roleDetails.prestataire?.id;

  return useQuery({
    queryKey: ["my-prestataire", utilisateur?._id, prestataireId],
    queryFn: async (): Promise<Prestataire | null> => {
      if (prestataireId) {
        try {
          return await fetchPrestataireById(prestataireId);
        } catch {
          // fallback par utilisateur
        }
      }
      if (!utilisateur?._id) return null;
      const list = await fetchPrestataires({ utilisateur: utilisateur._id });
      return list[0] ?? null;
    },
    enabled: !!utilisateur?._id,
    staleTime: 60_000,
  });
}
