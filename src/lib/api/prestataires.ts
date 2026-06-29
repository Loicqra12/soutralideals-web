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
  const { source = "web", ...fields } = payload;
  Object.entries(fields).forEach(([key, value]) => {
    if (value != null && value !== "") {
      formData.append(key, String(value));
    }
  });
  formData.append("source", source);
  if (files?.cni1) formData.append("cni1", files.cni1);
  if (files?.cni2) formData.append("cni2", files.cni2);
  if (files?.selfie) formData.append("selfie", files.selfie);
  return postMultipart<Prestataire>("prestataire", formData);
}

export type PrestataireDocumentType = "cni_recto" | "cni_verso" | "selfie";

export interface FinalizePrestatairePayload {
  cni1?: string;
  cni2?: string;
  selfie?: string;
  localisation: string;
  localisationmaps: {
    latitude: number;
    longitude: number;
  };
}

export interface FinalizationStatusResponse {
  success: boolean;
  status: string;
  finalizationStatus: {
    isComplete: boolean;
    requiredDocs: {
      cni: boolean;
      selfie: boolean;
      location: boolean;
    };
  };
}

export async function uploadPrestataireDocument(
  prestataireId: string,
  documentType: PrestataireDocumentType,
  file: File,
): Promise<{ success: boolean; url: string; status?: string }> {
  const formData = new FormData();
  formData.append("prestataireId", prestataireId);
  formData.append("documentType", documentType);
  formData.append("document", file);
  return postMultipart("upload/document", formData);
}

export async function finalizePrestataireProfile(
  prestataireId: string,
  payload: FinalizePrestatairePayload,
) {
  const { data } = await apiClient.put<{
    success: boolean;
    message: string;
    prestataire: { id: string; status: string };
  }>(`/prestataire/${prestataireId}/finalize`, payload);
  return data;
}

export async function getPrestataireFinalizationStatus(prestataireId: string) {
  const { data } = await apiClient.get<FinalizationStatusResponse>(
    `/prestataire/${prestataireId}/finalization-status`,
  );
  return data;
}

export async function submitPrestataireFinalization(
  prestataireId: string,
  input: {
    files: { cni1?: File; cni2?: File; selfie?: File };
    existing: { cni1?: string; cni2?: string; selfie?: string };
    localisation: string;
    localisationmaps: { latitude: number; longitude: number };
  },
) {
  let cni1 = input.existing.cni1;
  let cni2 = input.existing.cni2;
  let selfie = input.existing.selfie;

  if (input.files.cni1) {
    const res = await uploadPrestataireDocument(prestataireId, "cni_recto", input.files.cni1);
    cni1 = res.url;
  }
  if (input.files.cni2) {
    const res = await uploadPrestataireDocument(prestataireId, "cni_verso", input.files.cni2);
    cni2 = res.url;
  }
  if (input.files.selfie) {
    const res = await uploadPrestataireDocument(prestataireId, "selfie", input.files.selfie);
    selfie = res.url;
  }

  if (!cni1 || !cni2 || !selfie) {
    throw new Error("CNI recto, CNI verso et selfie sont obligatoires.");
  }

  return finalizePrestataireProfile(prestataireId, {
    cni1,
    cni2,
    selfie,
    localisation: input.localisation,
    localisationmaps: input.localisationmaps,
  });
}
