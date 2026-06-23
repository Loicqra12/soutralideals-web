"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchFreelanceById } from "@/lib/api/freelances";

export function useFreelanceById(id: string) {
  return useQuery({
    queryKey: ["freelance", id],
    queryFn: () => fetchFreelanceById(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
}
