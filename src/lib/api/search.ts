import apiClient from "./client";

export interface GlobalSearchResults {
  services?: unknown[];
  articles?: unknown[];
  freelances?: unknown[];
  vendeurs?: unknown[];
  prestataires?: unknown[];
}

interface GlobalSearchResponse {
  query?: string;
  results?: GlobalSearchResults;
  counts?: Record<string, number>;
}

export async function globalSearch(query: string): Promise<GlobalSearchResults> {
  const { data } = await apiClient.get<GlobalSearchResponse>("/search/global", {
    params: { query },
  });
  return data.results ?? {};
}
