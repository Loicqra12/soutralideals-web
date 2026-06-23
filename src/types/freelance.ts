import type { Service } from "./categorie";
export interface UtilisateurRef {
  _id?: string;
  nom?: string;
  prenom?: string;
  photoProfil?: string;
}

export interface Freelance {
  _id: string;
  /** Champs API sdealsapp / backend */
  name?: string;
  job?: string;
  category?: string;
  rating?: number;
  location?: string;
  imagePath?: string;
  /** Alias frontend legacy */
  nom?: string;
  prenom?: string;
  categorie?: string;
  service?: string | Service;
  note?: number;
  verifier?: boolean;
  ville?: string;
  utilisateur?: UtilisateurRef | string;
  photoProfil?: string;
  description?: string;
  tarif?: number;
  hourlyRate?: number;
  phoneNumber?: string;
  skills?: string[];
  completedJobs?: number;
  availabilityStatus?: string;
  experienceLevel?: string;
}

export interface FreelanceSearchParams {
  q?: string;
  category?: string;
  limit?: number;
}
