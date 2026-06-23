import apiClient from "./client";

export interface CommandeArticle {
  nom: string;
  quantite: number;
  image?: string;
  prix: number;
  prixTotal?: number;
}

export interface Commande {
  _id: string;
  utilisateur?: string;
  infoCommande?: {
    addresse?: string;
    ville?: string;
    telephone?: string;
    codePostal?: string;
    pays?: string;
  };
  articles: CommandeArticle[];
  prixArticles: number;
  prixLivraison?: number;
  prixTotal: number;
  statusCommande: string;
  moyenPaiement?: string;
  dateCreation?: string;
  createdAt?: string;
}

interface CommandesResponse {
  commandes: Commande[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export async function fetchMyCommandes(params?: {
  page?: number;
  limit?: number;
  status?: string;
}): Promise<CommandesResponse> {
  const { data } = await apiClient.get<CommandesResponse>("/commandes/mes-commandes", {
    params,
  });
  return data;
}

export async function fetchCommandeById(id: string): Promise<Commande> {
  const { data } = await apiClient.get<Commande>(`/commande/${id}`);
  return data;
}
