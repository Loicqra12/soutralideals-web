"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchFreelanceById,
  fetchFreelancesByUtilisateur,
} from "@/lib/api/freelances";
import { useAuthStore } from "@/stores";
import type { Freelance } from "@/types";

export function useMyFreelance() {
  const utilisateur = useAuthStore((s) => s.utilisateur);
  const roleDetails = useAuthStore((s) => s.roleDetails);
  const freelanceId = roleDetails.freelance?.id;

  return useQuery({
    queryKey: ["my-freelance", utilisateur?._id, freelanceId],
    queryFn: async (): Promise<Freelance | null> => {
      if (freelanceId) {
        try {
          return await fetchFreelanceById(freelanceId);
        } catch {
          // fallback par utilisateur
        }
      }
      if (!utilisateur?._id) return null;
      const list = await fetchFreelancesByUtilisateur(utilisateur._id);
      return list[0] ?? null;
    },
    enabled: !!utilisateur?._id,
    staleTime: 60_000,
  });
}
