import apiClient from "./client";

export async function fetchSuggestions(query: string): Promise<string[]> {
  if (!query || query.trim().length < 1) return [];
  const { data } = await apiClient.get<string[]>("/search/suggestions", {
    params: { query: query.trim() },
  });
  return Array.isArray(data) ? data : [];
}
