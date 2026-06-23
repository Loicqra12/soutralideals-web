"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchVendeurs } from "@/lib/api/vendeurs";

export function useVendeurs() {
  return useQuery({
    queryKey: ["vendeurs"],
    queryFn: () => fetchVendeurs(),
    staleTime: 5 * 60 * 1000,
  });
}
