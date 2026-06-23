import apiClient from "./client";
import type {
  CreatePrestationPayload,
  Prestation,
  PrestationStats,
  PrestationsListResponse,
} from "@/types/prestation";

export type { CreatePrestationPayload } from "@/types/prestation";

export async function createPrestation(payload: CreatePrestationPayload) {
  const { data } = await apiClient.post("/prestation", payload);
  return data;
}

export async function fetchPrestationsByPrestataire(
  prestataireId: string,
  params?: { page?: number; limit?: number; statut?: string },
): Promise<PrestationsListResponse> {
  const { data } = await apiClient.get<PrestationsListResponse>(
    `/prestations/prestataire/${prestataireId}`,
    { params },
  );
  return data;
}

export async function fetchPrestationStats(
  prestataireId: string,
): Promise<PrestationStats> {
  const { data } = await apiClient.get<PrestationStats>(
    "/prestations/stats",
    { params: { prestataireId } },
  );
  return data;
}

export async function updatePrestationStatut(
  id: string,
  statut: string,
  commentaire?: string,
): Promise<Prestation> {
  const { data } = await apiClient.patch<{ prestation: Prestation }>(
    `/prestation/${id}/statut`,
    { statut, commentaire },
  );
  return data.prestation ?? (data as unknown as Prestation);
}
