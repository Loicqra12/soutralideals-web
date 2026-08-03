/**
 * Service d'authentification Google OAuth
 * Gère la connexion et l'inscription via Google Sign-In
 */

import type { SessionResponse } from "@/lib/api/auth";

export const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

/**
 * Connexion avec Google - Envoie l'idToken au backend
 */
export async function loginWithGoogle(
  idToken: string,
): Promise<SessionResponse> {
  const res = await fetch("/api/auth/google-login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? "Connexion Google échouée");
  }

  return res.json();
}
