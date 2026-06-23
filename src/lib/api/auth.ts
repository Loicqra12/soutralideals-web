import type { LoginPayload, RegisterPayload, Utilisateur } from "@/types";
import type { RoleDetails } from "@/lib/auth/roles";

export interface SessionResponse {
  utilisateur: Utilisateur;
  roles: string[];
  activeRole: string;
  roleDetails?: RoleDetails;
}

export async function login(payload: LoginPayload): Promise<SessionResponse> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? "Connexion impossible");
  }
  return res.json();
}

export async function register(payload: RegisterPayload): Promise<SessionResponse> {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? "Inscription impossible");
  }
  return res.json();
}

export async function logout(): Promise<void> {
  await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });
}

export async function getSession(): Promise<SessionResponse | null> {
  const res = await fetch("/api/auth/session", { credentials: "include" });
  if (!res.ok) return null;
  const data = await res.json();
  return data;
}

export async function refreshRoles(): Promise<{
  roles: string[];
  roleDetails?: RoleDetails;
}> {
  const res = await fetch("/api/auth/refresh-roles", {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Impossible de rafraîchir les rôles");
  const data = await res.json();
  return {
    roles: data.roles ?? ["CLIENT"],
    roleDetails: data.roleDetails,
  };
}
