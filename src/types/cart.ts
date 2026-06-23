import type { Vendeur } from "@/types";

export interface CartLineItem {
  _id?: string;
  article: string | { _id?: string; nomArticle?: string };
  vendeur: string | { _id?: string };
  nomArticle?: string;
  prixUnitaire?: number;
  quantite: number;
  imageArticle?: string;
}

export interface Cart {
  _id?: string;
  utilisateur: string;
  articles: CartLineItem[];
  montantArticles?: number;
  fraisLivraison?: number;
  montantTotal?: number;
  statut?: string;
  adresseLivraison?: {
    adresse?: string;
    ville?: string;
    telephone?: string;
    pays?: string;
    codePostal?: string;
  };
}

export function getVendeurId(vendeur?: string | Vendeur): string | undefined {
  if (!vendeur) return undefined;
  if (typeof vendeur === "string") return vendeur;
  return vendeur._id;
}
