"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchArticles } from "@/lib/api/articles";

export function useArticles() {
  return useQuery({
    queryKey: ["articles"],
    queryFn: () => fetchArticles(),
    staleTime: 5 * 60 * 1000,
  });
}
