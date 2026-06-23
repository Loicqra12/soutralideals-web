"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchVendeurById,
  fetchVendeursByUtilisateur,
} from "@/lib/api/vendeurs";
import { useAuthStore } from "@/stores";
import type { Vendeur } from "@/types";

export function useMyVendeur() {
  const utilisateur = useAuthStore((s) => s.utilisateur);
  const roleDetails = useAuthStore((s) => s.roleDetails);
  const vendeurId = roleDetails.vendeur?.id;

  return useQuery({
    queryKey: ["my-vendeur", utilisateur?._id, vendeurId],
    queryFn: async (): Promise<Vendeur | null> => {
      if (vendeurId) {
        try {
          return await fetchVendeurById(vendeurId);
        } catch {
          // fallback par utilisateur
        }
      }
      if (!utilisateur?._id) return null;
      const list = await fetchVendeursByUtilisateur(utilisateur._id);
      return list[0] ?? null;
    },
    enabled: !!utilisateur?._id,
    staleTime: 60_000,
  });
}
