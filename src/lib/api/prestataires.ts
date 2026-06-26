import apiClient from "./client";
import type { Prestataire, PrestataireFilters } from "@/types";
import { postMultipart } from "./multipart";

export interface CreatePrestatairePayload {
  utilisateur: string;
  service: string;
  prixprestataire: number;
  localisation: string;
  description?: string;
  anneeExperience?: string;
  source?: string;
}

export async function fetchPrestataires(
  filters?: PrestataireFilters,
): Promise<Prestataire[]> {
  const { serviceName: _sn, ...apiParams } = filters ?? {};
  const { data } = await apiClient.get<Prestataire[]>("/prestataire", {
    params: apiParams,
  });
  return data;
}

export async function fetchPrestataireById(id: string): Promise<Prestataire> {
  const { data } = await apiClient.get<Prestataire>(`/prestataire/${id}`);
  return data;
}

export interface UpdatePrestatairePayload {
  description?: string;
  prixprestataire?: number;
  tarifHoraireMin?: number;
  tarifHoraireMax?: number;
  localisation?: string;
  ville?: string;
  anneeExperience?: string;
  specialite?: string[];
  zoneIntervention?: string[];
  rayonIntervention?: number;
}

export async function updatePrestataire(
  id: string,
  payload: UpdatePrestatairePayload,
): Promise<Prestataire> {
  const { data } = await apiClient.put<Prestataire>(`/prestataire/${id}`, payload);
  return data;
}

export async function createPrestataire(
  payload: CreatePrestatairePayload,
  files?: { cni1?: File; cni2?: File; selfie?: File },
) {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value != null && value !== "") {
      formData.append(key, String(value));
    }
  });
  formData.append("source", payload.source ?? "web");
  if (files?.cni1) formData.append("cni1", files.cni1);
  if (files?.cni2) formData.append("cni2", files.cni2);
  if (files?.selfie) formData.append("selfie", files.selfie);
  return postMultipart<Prestataire>("prestataire", formData);
}
