import apiClient from "./client";

export type AvisObjetType = "PRESTATAIRE" | "FREELANCE" | "VENDEUR" | "ARTICLE";

export interface Avis {
  _id: string;
  auteur?: {
    _id?: string;
    nom?: string;
    prenom?: string;
    photoProfil?: string;
  };
  objetType: AvisObjetType;
  objetId: string;
  note: number;
  titre: string;
  commentaire: string;
  recommande?: boolean;
  statut?: string;
  utile?: number;
  createdAt?: string;
}

export interface AvisStats {
  moyenne: number;
  total: number;
  distribution: Record<string, number>;
}

export async function fetchAvis(
  objetType: AvisObjetType,
  objetId: string,
  params?: { page?: number; limit?: number },
): Promise<{ avis: Avis[]; total: number }> {
  const { data } = await apiClient.get<{ avis: Avis[]; total: number }>("/avis", {
    params: { objetType, objetId, ...params },
  });
  return { avis: data.avis ?? (data as unknown as Avis[]) ?? [], total: data.total ?? 0 };
}

export async function fetchAvisStats(
  objetType: AvisObjetType,
  objetId: string,
): Promise<AvisStats> {
  const { data } = await apiClient.get<{ stats: AvisStats }>(
    `/avis/stats/${objetType}/${objetId}`,
  );
  return data.stats ?? { moyenne: 0, total: 0, distribution: {} };
}

export async function createAvis(payload: {
  objetType: AvisObjetType;
  objetId: string;
  note: number;
  titre: string;
  commentaire: string;
  recommande?: boolean;
}): Promise<Avis> {
  const { data } = await apiClient.post<Avis>("/avis", payload);
  return data;
}
