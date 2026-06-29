import type { Service, Categorie } from "./categorie";

export interface UtilisateurRef {
  _id?: string;
  nom?: string;
  prenom?: string;
  photoProfil?: string;
  email?: string;
  telephone?: string;
}

export interface Prestataire {
  _id: string;
  nom?: string;
  prenom?: string;
  utilisateur?: UtilisateurRef | string;
  service?: string | Service;
  categorie?: string | Categorie;
  specialite?: string[];
  verifier?: boolean;
  note?: number;
  ville?: string;
  localisation?: string;
  adresse?: string;
  photoProfil?: string;
  selfie?: string;
  description?: string;
  anneeExperience?: string;
  prixprestataire?: number;
  tarifHoraireMin?: number;
  tarifHoraireMax?: number;
  zoneIntervention?: string[];
  rayonIntervention?: number;
  nbMission?: number;
  nbAvis?: number;
  status?: "incomplete" | "pending" | "active" | "rejected" | "suspended";
  source?: string;
  cni1?: string;
  cni2?: string;
  localisationmaps?: {
    latitude?: number;
    longitude?: number;
  };
  geoloc?: {
    lat: number;
    lng: number;
  };
}

export interface PrestataireFilters {
  service?: string;
  serviceName?: string;
  categorie?: string;
  ville?: string;
  verified?: boolean;
  limit?: number;
  utilisateur?: string;
}
