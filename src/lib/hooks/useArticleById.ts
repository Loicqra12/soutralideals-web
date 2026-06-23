"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchArticleById } from "@/lib/api/articles";

export function useArticleById(id: string) {
  return useQuery({
    queryKey: ["article", id],
    queryFn: () => fetchArticleById(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
}
