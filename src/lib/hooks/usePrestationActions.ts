"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePrestationStatut } from "@/lib/api/prestations";

export function usePrestationActions(prestataireId?: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      id,
      statut,
      commentaire,
    }: {
      id: string;
      statut: string;
      commentaire?: string;
    }) => updatePrestationStatut(id, statut, commentaire),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prestataire-missions"] });
      queryClient.invalidateQueries({ queryKey: ["prestataire-missions-all"] });
      queryClient.invalidateQueries({ queryKey: ["prestataire-dashboard"] });
      if (prestataireId) {
        queryClient.invalidateQueries({
          queryKey: ["prestataire-missions", prestataireId],
        });
      }
    },
  });

  return {
    updateStatut: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    error: mutation.error,
  };
}
