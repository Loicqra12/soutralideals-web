"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import type { Service } from "@/types";
import { matchesGroupe } from "@/lib/utils/filters";

async function fetchAllServices(): Promise<Service[]> {
  const { data } = await apiClient.get<Service[]>("/service");
  return data;
}

export function useServicesByGroupe(groupeName: string) {
  return useQuery({
    queryKey: ["services", groupeName],
    queryFn: async () => {
      const all = await fetchAllServices();
      return all.filter((s) => {
        const cat = typeof s.categorie === "object" ? s.categorie : null;
        if (!cat) return false;
        const groupe = typeof cat.groupe === "object" ? cat.groupe : null;
        return groupe ? matchesGroupe(groupe.nomgroupe, groupeName) : false;
      });
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useServicesByCategorie(categorieId: string) {
  return useQuery({
    queryKey: ["services", "categorie", categorieId],
    queryFn: async () => {
      const all = await fetchAllServices();
      return all.filter((s) => {
        const cat = typeof s.categorie === "object" ? s.categorie : s.categorie;
        if (typeof cat === "string") return cat === categorieId;
        return cat?._id === categorieId;
      });
    },
    staleTime: 10 * 60 * 1000,
    enabled: !!categorieId,
  });
}
