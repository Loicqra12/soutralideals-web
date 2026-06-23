"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchPrestataires } from "@/lib/api/prestataires";
import type { PrestataireFilters } from "@/types";

export function usePrestataires(filters?: PrestataireFilters) {
  return useQuery({
    queryKey: ["prestataires", filters],
    queryFn: () => fetchPrestataires(filters),
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}
