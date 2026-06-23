"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchFavorites, toggleFavorite, type FavoriteType } from "@/lib/api/favorites";
import { useAuthStore } from "@/stores";
import { toast } from "sonner";

export function useFavorites(objetType?: FavoriteType) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: ["favorites", objetType],
    queryFn: () => fetchFavorites(objetType),
    enabled: isAuthenticated,
    staleTime: 60_000,
  });
}

export function useIsFavorite(objetType: FavoriteType, objetId: string) {
  const { data: favorites } = useFavorites(objetType);
  return favorites?.some((f) => f.objetId === objetId && f.statut !== "SUPPRIME") ?? false;
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useMutation({
    mutationFn: toggleFavorite,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      toast.success(result.isFavorite ? "Ajouté aux favoris" : "Retiré des favoris");
    },
    onError: () => toast.error("Impossible de mettre à jour les favoris"),
    onMutate: () => {
      if (!isAuthenticated) {
        toast.error("Connectez-vous pour ajouter aux favoris");
        throw new Error("non authentifié");
      }
    },
  });
}
