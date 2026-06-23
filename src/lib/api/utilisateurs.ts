import type { Utilisateur } from "@/types";

export interface UpdateProfilePayload {
  nom?: string;
  prenom?: string;
  email?: string;
  telephone?: string;
  genre?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export async function updateProfile(
  payload: UpdateProfilePayload,
): Promise<Utilisateur> {
  const res = await fetch("/api/auth/profile", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? "Mise à jour impossible");
  }

  const data = (await res.json()) as { utilisateur: Utilisateur };
  return data.utilisateur;
}

export async function updateProfilePhoto(file: File): Promise<Utilisateur> {
  const formData = new FormData();
  formData.append("photoProfil", file);

  const res = await fetch("/api/auth/profile", {
    method: "PUT",
    body: formData,
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? "Photo non enregistrée");
  }

  const data = (await res.json()) as { utilisateur: Utilisateur };
  return data.utilisateur;
}

export async function changePassword(
  payload: ChangePasswordPayload,
): Promise<void> {
  const res = await fetch("/api/auth/change-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? "Changement de mot de passe impossible");
  }
}
