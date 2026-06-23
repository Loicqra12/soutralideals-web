export type PrestationStatut =
  | "EN_ATTENTE"
  | "ACCEPTEE"
  | "CONFIRMEE"
  | "EN_COURS"
  | "TERMINEE"
  | "ANNULEE"
  | "REFUSEE";

export interface CreatePrestationPayload {
  utilisateur: string;
  prestataire?: string;
  service?: string;
  adresse: string;
  ville: string;
  datePrestation?: string;
  description?: string;
  notesClient?: string;
  telephoneUrgence?: string;
}

export interface Prestation {
  _id: string;
  utilisateur?: {
    _id?: string;
    nom?: string;
    prenom?: string;
    email?: string;
    telephone?: string;
  };
  prestataire?: string;
  service?: { _id?: string; nomservice?: string } | string;
  datePrestation?: string;
  adresse?: string;
  ville?: string;
  description?: string;
  montantTotal?: number;
  statut?: PrestationStatut;
  createdAt?: string;
}

export interface PrestationStats {
  statsParStatut: { _id: string; count: number; totalRevenu: number }[];
  statsParVille: { _id: string; count: number; totalRevenu: number }[];
  totalPrestations: number;
  revenueTotal: number;
}

export interface PrestationsListResponse {
  prestations: Prestation[];
  total: number;
  totalPages: number;
  currentPage: number;
}
