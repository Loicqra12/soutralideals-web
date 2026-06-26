import apiClient from "./client";
import type { Freelance, FreelanceSearchParams } from "@/types";
import { postMultipart } from "./multipart";

export interface CreateFreelancePayload {
  utilisateur: string;
  name: string;
  job: string;
  category: string;
  hourlyRate: number;
  location: string;
  phoneNumber?: string;
  description?: string;
  experienceLevel?: string;
  availabilityStatus?: string;
  workingHours?: string;
  skills?: string[];
}

function normalizeFreelancesPayload(data: unknown): Freelance[] {
  if (Array.isArray(data)) return data;
  if (
    data &&
    typeof data === "object" &&
    Array.isArray((data as { freelances?: unknown }).freelances)
  ) {
    return (data as { freelances: Freelance[] }).freelances;
  }
  return [];
}

export async function fetchFreelances(params?: {
  page?: number;
  limit?: number;
  utilisateur?: string;
}): Promise<Freelance[]> {
  const { data } = await apiClient.get<unknown>("/freelance", { params });
  return normalizeFreelancesPayload(data);
}

export async function fetchFreelancesByUtilisateur(
  userId: string,
): Promise<Freelance[]> {
  return fetchFreelances({ utilisateur: userId, limit: 1 });
}

export async function fetchFreelanceById(id: string): Promise<Freelance> {
  const { data } = await apiClient.get<Freelance>(`/freelance/${id}`);
  return data;
}

export async function searchFreelances(
  params: FreelanceSearchParams,
): Promise<Freelance[]> {
  const { q, category, ...rest } = params;
  const { data } = await apiClient.get<Freelance[]>("/freelances/search", {
    params: { ...rest, query: q, category },
  });
  return Array.isArray(data) ? data : [];
}

export async function createFreelance(
  payload: CreateFreelancePayload,
  files?: { profileImage?: File; cni1?: File; cni2?: File; selfie?: File },
) {
  const formData = new FormData();
  formData.append("utilisateur", payload.utilisateur);
  formData.append("name", payload.name);
  formData.append("job", payload.job);
  formData.append("category", payload.category);
  formData.append("hourlyRate", String(payload.hourlyRate));
  formData.append("location", payload.location);
  if (payload.phoneNumber) formData.append("phoneNumber", payload.phoneNumber);
  if (payload.description) formData.append("description", payload.description);
  if (payload.experienceLevel) {
    formData.append("experienceLevel", payload.experienceLevel);
  }
  if (payload.availabilityStatus) {
    formData.append("availabilityStatus", payload.availabilityStatus);
  }
  if (payload.workingHours) formData.append("workingHours", payload.workingHours);
  if (payload.skills?.length) {
    formData.append("skills", JSON.stringify(payload.skills));
  }
  if (files?.profileImage) formData.append("profileImage", files.profileImage);
  if (files?.cni1) formData.append("cni1", files.cni1);
  if (files?.cni2) formData.append("cni2", files.cni2);
  if (files?.selfie) formData.append("selfie", files.selfie);
  return postMultipart<Freelance>("freelance", formData);
}

export interface UpdateFreelancePayload {
  name?: string;
  job?: string;
  description?: string;
  hourlyRate?: number;
  location?: string;
  availabilityStatus?: string;
  experienceLevel?: string;
  workingHours?: string;
  skills?: string[];
}

export async function updateFreelance(
  id: string,
  payload: UpdateFreelancePayload,
): Promise<Freelance> {
  const { data } = await apiClient.put<Freelance>(`/freelance/${id}`, payload);
  return data;
}

export async function fetchFreelancesByCategory(
  category: string,
): Promise<Freelance[]> {
  const { data } = await apiClient.get<Freelance[]>(
    `/freelances/category/${encodeURIComponent(category)}`,
  );
  return data;
}
