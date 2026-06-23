import type { Categorie } from "@/types";

type ServiceLike =
  | string
  | { nomservice?: string; categorie?: CategorieLike }
  | null
  | undefined;
type CategorieLike = string | Categorie | null | undefined;
type UtilisateurLike =
  | { nom?: string; prenom?: string; photoProfil?: string }
  | string
  | null
  | undefined;

export function getServiceLabel(service: ServiceLike): string | undefined {
  if (!service) return undefined;
  if (typeof service === "string") return service;
  return service.nomservice;
}

export function getCategoryLabel(
  categorie?: CategorieLike,
  service?: ServiceLike,
): string | undefined {
  if (typeof categorie === "string" && categorie) return categorie;
  if (categorie && typeof categorie === "object") return categorie.nomcategorie;

  const nested =
    service && typeof service === "object" ? service.categorie : undefined;
  if (typeof nested === "string") return undefined;
  if (nested && typeof nested === "object") return nested.nomcategorie;

  return undefined;
}

export function getUtilisateurDisplayName(
  directNom?: string,
  directPrenom?: string,
  utilisateur?: UtilisateurLike,
  fallback = "Prestataire",
): string {
  if (directNom) {
    return directPrenom ? `${directPrenom} ${directNom}` : directNom;
  }
  if (utilisateur && typeof utilisateur === "object") {
    const { nom, prenom } = utilisateur;
    if (nom) return prenom ? `${prenom} ${nom}` : nom;
  }
  return fallback;
}

export function getUtilisateurPhoto(
  directPhoto?: string,
  utilisateur?: UtilisateurLike,
): string | undefined {
  if (directPhoto) return directPhoto;
  if (utilisateur && typeof utilisateur === "object") {
    return utilisateur.photoProfil;
  }
  return undefined;
}

export function getEntityServiceId(
  service: (ServiceLike & { _id?: string }) | null | undefined,
): string | undefined {
  if (!service) return undefined;
  if (typeof service === "string") return service;
  return service._id;
}

/** Filtre par service catalogue (id ou nom exact). */
export function matchesServiceFilter(
  entityService: (ServiceLike & { _id?: string }) | null | undefined,
  serviceId?: string | null,
  serviceName?: string | null,
): boolean {
  if (!serviceId && !serviceName) return true;
  if (!entityService) return false;

  if (typeof entityService === "string") {
    return Boolean(serviceId && entityService === serviceId);
  }

  if (serviceId && entityService._id === serviceId) return true;
  if (
    serviceName &&
    entityService.nomservice?.toLowerCase() === serviceName.toLowerCase()
  ) {
    return true;
  }
  return false;
}

/** Filtre par nom de catégorie (e-marché). */
export function matchesCategoryFilter(
  categorie?: CategorieLike,
  service?: ServiceLike,
  categoryName?: string | null,
): boolean {
  if (!categoryName?.trim()) return true;
  const label = getCategoryLabel(categorie, service);
  return label?.toLowerCase() === categoryName.trim().toLowerCase();
}

export function getPrestatairePhone(
  prestataire: {
    utilisateur?: UtilisateurLike & { telephone?: string };
  },
): string | undefined {
  if (prestataire.utilisateur && typeof prestataire.utilisateur === "object") {
    return prestataire.utilisateur.telephone;
  }
  return undefined;
}

export function getFreelancePhone(freelance: {
  phoneNumber?: string;
  utilisateur?: UtilisateurLike & { telephone?: string };
}): string | undefined {
  if (freelance.phoneNumber) return freelance.phoneNumber;
  if (freelance.utilisateur && typeof freelance.utilisateur === "object") {
    return freelance.utilisateur.telephone;
  }
  return undefined;
}
