import apiClient from "./client";
import type { Vendeur } from "@/types";
import { postMultipart } from "./multipart";

export interface CreateVendeurPayload {
  utilisateur: string;
  shopName: string;
  shopDescription: string;
  businessType: string;
  businessCategories: string[];
  businessPhone?: string;
  businessEmail?: string;
  returnPolicy?: string;
  businessAddress?: {
    street?: string;
    city?: string;
    country?: string;
  };
  paymentMethods?: string[];
  preferredContactMethod?: string;
}

export async function fetchVendeurs(params?: {
  utilisateur?: string;
  limit?: number;
}): Promise<Vendeur[]> {
  const { data } = await apiClient.get<Vendeur[] | { vendeurs: Vendeur[] }>(
    "/vendeur",
    { params },
  );
  if (Array.isArray(data)) return data;
  return data.vendeurs ?? [];
}

export async function fetchVendeursByUtilisateur(
  userId: string,
): Promise<Vendeur[]> {
  return fetchVendeurs({ utilisateur: userId, limit: 1 });
}

export async function fetchVendeurById(id: string): Promise<Vendeur> {
  const { data } = await apiClient.get<Vendeur>(`/vendeur/${id}`);
  return data;
}

export async function createVendeur(
  payload: CreateVendeurPayload,
  files?: {
    shopLogo?: File;
    cni1?: File;
    cni2?: File;
    selfie?: File;
  },
) {
  const formData = new FormData();
  formData.append("utilisateur", payload.utilisateur);
  formData.append("shopName", payload.shopName);
  formData.append("shopDescription", payload.shopDescription);
  formData.append("businessType", payload.businessType);
  formData.append("businessCategories", JSON.stringify(payload.businessCategories));
  if (payload.businessPhone) formData.append("businessPhone", payload.businessPhone);
  if (payload.businessEmail) formData.append("businessEmail", payload.businessEmail);
  if (payload.returnPolicy) formData.append("returnPolicy", payload.returnPolicy);
  if (payload.businessAddress) {
    formData.append("businessAddress", JSON.stringify(payload.businessAddress));
  }
  if (payload.paymentMethods?.length) {
    formData.append("paymentMethods", JSON.stringify(payload.paymentMethods));
  }
  if (payload.preferredContactMethod) {
    formData.append("preferredContactMethod", payload.preferredContactMethod);
  }
  if (files?.shopLogo) formData.append("shopLogo", files.shopLogo);
  if (files?.cni1) formData.append("cni1", files.cni1);
  if (files?.cni2) formData.append("cni2", files.cni2);
  if (files?.selfie) formData.append("selfie", files.selfie);
  return postMultipart<Vendeur>("vendeur", formData);
}
