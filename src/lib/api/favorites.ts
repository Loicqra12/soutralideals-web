import apiClient from "./client";

export type FavoriteType = "PRESTATAIRE" | "FREELANCE" | "ARTICLE" | "VENDEUR";

export interface Favorite {
  _id: string;
  objetType: FavoriteType;
  objetId: string;
  titre: string;
  description?: string;
  image?: string;
  prix?: number;
  statut: string;
  dateAjout?: string;
}

export async function fetchFavorites(objetType?: FavoriteType): Promise<Favorite[]> {
  const { data } = await apiClient.get<{ favorites: Favorite[] }>("/favorites", {
    params: objetType ? { objetType } : {},
  });
  return data.favorites ?? [];
}

export async function toggleFavorite(payload: {
  objetType: FavoriteType;
  objetId: string;
  titre: string;
  description?: string;
  image?: string;
  prix?: number;
}): Promise<{ isFavorite: boolean }> {
  const { data } = await apiClient.post<{ isFavorite: boolean; favorite?: Favorite }>(
    "/favorites/toggle",
    payload,
  );
  return { isFavorite: data.isFavorite ?? true };
}

export async function checkFavorite(objetType: FavoriteType, objetId: string): Promise<boolean> {
  try {
    const favorites = await fetchFavorites(objetType);
    return favorites.some((f) => f.objetId === objetId && f.statut !== "SUPPRIME");
  } catch {
    return false;
  }
}
