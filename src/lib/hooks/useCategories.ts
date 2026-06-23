"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchCategoriesByGroupe } from "@/lib/api/categories";
import { POLE_GROUPE_NAMES, type PoleType } from "@/lib/utils/filters";

export function useCategoriesByPole(pole: PoleType) {
  const groupe = POLE_GROUPE_NAMES[pole];
  return useQuery({
    queryKey: ["categories", groupe],
    queryFn: () => fetchCategoriesByGroupe(groupe),
    staleTime: 10 * 60 * 1000,
  });
}

export function useCategoriesByGroupe(groupe: string) {
  return useQuery({
    queryKey: ["categories", groupe],
    queryFn: () => fetchCategoriesByGroupe(groupe),
    staleTime: 10 * 60 * 1000,
  });
}
