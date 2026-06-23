"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchFreelances } from "@/lib/api/freelances";
import type { Freelance } from "@/types";

export function useFreelances() {
  return useQuery<Freelance[]>({
    queryKey: ["freelances"],
    queryFn: () => fetchFreelances(),
    staleTime: 5 * 60 * 1000,
  });
}
