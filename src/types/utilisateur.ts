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
}

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
  telephone: string;         // Obligatoire côté backend
  password: string;
  email?: string;
  genre?: string;
  role?: string;             // PascalCase : "Client", "Prestataire"…
}
