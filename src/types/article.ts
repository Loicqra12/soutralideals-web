import type { Categorie } from "./categorie";
import type { UtilisateurRef } from "./prestataire";

export interface VendeurSocialMedia {
  whatsapp?: string;
  facebook?: string;
  instagram?: string;
  website?: string;
}

export interface Vendeur {
  _id: string;
  shopName?: string;
  nom?: string;
  shopDescription?: string;
  shopLogo?: string;
  rating?: number;
  verifier?: boolean;
  ville?: string;
  photoProfil?: string;
  description?: string;
  businessPhone?: string;
  businessEmail?: string;
  socialMedia?: VendeurSocialMedia;
  utilisateur?: UtilisateurRef | string;
}

export interface Article {
  _id?: string;
  nomArticle: string;
  prixArticle: number;
  ancienPrixArticle?: number;
  discountPercent?: number;
  isPromo?: boolean;
  quantiteArticle?: number;
  photoArticle?: string;
  description?: string;
  rating?: number;
  salesCount?: number;
  tags?: string[];
  categorie?: string | Categorie;
  vendeur?: string | Vendeur;
}
