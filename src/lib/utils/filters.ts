import removeAccents from "remove-accents";

export type PoleType = "metiers" | "freelance" | "emarche";

export const POLE_LABELS: Record<PoleType, string> = {
  metiers: "Métiers",
  freelance: "Freelance",
  emarche: "E-marché",
};

export const POLE_GROUPE_NAMES: Record<PoleType, string> = {
  metiers: "Métiers",
  freelance: "Freelance",
  emarche: "E-marché",
};

export function normalizeString(value: string): string {
  return removeAccents(value.toLowerCase().trim());
}

export function matchesGroupe(
  groupeName: string | undefined,
  targetGroupe: string,
): boolean {
  if (!groupeName) return false;
  return normalizeString(groupeName) === normalizeString(targetGroupe);
}

export function poleToPath(pole: PoleType): string {
  switch (pole) {
    case "metiers":
      return "/prestataires";
    case "freelance":
      return "/freelance";
    case "emarche":
      return "/emarche";
  }
}

export function poleSearchPlaceholder(pole: PoleType): string {
  switch (pole) {
    case "metiers":
      return "Ex: coiffeur, plombier, peintre...";
    case "freelance":
      return "Ex: développeur, designer, rédacteur...";
    case "emarche":
      return "Ex: téléphone, vêtements, alimentation...";
  }
}
