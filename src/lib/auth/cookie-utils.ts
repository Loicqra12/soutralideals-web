import type { Utilisateur } from "@/types";

// ─────────────────────────────────────────────────────────────
// Noms des cookies (source unique de vérité)
// ─────────────────────────────────────────────────────────────
export const COOKIE_NAMES = {
  token: "auth_token",
  user: "user_data",
  roles: "user_roles",
  refreshToken: "refresh_token",
} as const;

// ─────────────────────────────────────────────────────────────
// Options de sécurité uniformes (7 jours)
// ─────────────────────────────────────────────────────────────
export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 jours
};

export const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/api/auth", // Sécurité accrue : accessible uniquement aux endpoints auth
  maxAge: 60 * 60 * 24 * 30, // 30 jours
};

// ─────────────────────────────────────────────────────────────
// Supprime les champs sensibles renvoyés par le backend.
// Utilisateur déclare déjà password? et tokens? optionnels :
// le destructuring suffit, pas besoin d'index signature.
// ─────────────────────────────────────────────────────────────
export function sanitizeUser(user: Utilisateur): Omit<Utilisateur, "password" | "tokens" | "refreshTokens"> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, tokens, refreshTokens, ...safe } = user as Utilisateur & {
    refreshTokens?: unknown;
  };
  return safe;
}

// ─────────────────────────────────────────────────────────────
// Construit le payload minimal à stocker dans le cookie user_data.
// On ne stocke QUE les champs nécessaires à l'affichage et au
// middleware — évite les données stales sur les champs sensibles.
// ─────────────────────────────────────────────────────────────
export interface SafeUserCookiePayload {
  _id: string;
  nom: string;
  prenom?: string;
  role: string;
  photoProfil?: string;
  email?: string;
  telephone?: string;
}

export function buildSafeUserCookie(user: Utilisateur): SafeUserCookiePayload {
  return {
    _id: user._id,
    nom: user.nom,
    prenom: user.prenom,
    role: user.role,
    photoProfil: user.photoProfil,
    email: user.email,
    telephone: user.telephone,
  };
}
