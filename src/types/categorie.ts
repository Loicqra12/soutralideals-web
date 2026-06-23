export interface Groupe {
  _id: string;
  nomgroupe: string;
}

export interface Categorie {
  _id: string;
  nomcategorie: string;
  imagecategorie?: string;
  groupe: Groupe | string;
}

export interface Service {
  _id: string;
  nomservice: string;
  imageservice?: string;
  prixmoyen?: number;
  categorie?: Categorie | string;
}
