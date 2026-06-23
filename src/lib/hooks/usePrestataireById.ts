"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchPrestataireById } from "@/lib/api/prestataires";

export function usePrestataireById(id: string) {
  return useQuery({
    queryKey: ["prestataire", id],
    queryFn: () => fetchPrestataireById(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
}
