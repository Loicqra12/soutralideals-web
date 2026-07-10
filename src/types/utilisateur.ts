export interface Utilisateur {
  _id: string;
  nom: string;
  prenom: string;
  email?: string;
  telephone?: string;
  genre?: string;
  role: string;
  adresse?: string;
  ville?: string;
  photoProfil?: string;
  /** Présent dans la réponse brute du backend — toujours supprimé avant stockage */
  password?: string;
  /** Présent dans la réponse brute du backend — toujours supprimé avant stockage */
  tokens?: unknown[];
}

/**
 * Utilisateur sans les champs sensibles jamais exposés au client.
 * À utiliser partout sauf juste après l'appel backend (avant sanitize).
 */
export type SafeUtilisateur = Omit<Utilisateur, "password" | "tokens">;

export interface AuthResponse {
  utilisateur: Utilisateur;
  token: string;
}

export interface LoginPayload {
  identifiant: string;
  password: string;
}

export interface RegisterPayload {
  nom: string;
  prenom: string;
  telephone: string;
  password: string;
  email?: string;
  genre?: string;
  role?: string;
  phoneVerificationToken?: string;
}
