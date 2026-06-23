import type { Prestataire } from "@/types";

export interface ProfileCheckItem {
  id: string;
  label: string;
  done: boolean;
  hint?: string;
}

export function computeProfileStrength(profile: Prestataire | null | undefined) {
  if (!profile) {
    return {
      score: 0,
      total: 6,
      percent: 0,
      items: [] as ProfileCheckItem[],
      isVisible: false,
    };
  }

  const items: ProfileCheckItem[] = [
    {
      id: "service",
      label: "Service renseigné",
      done: !!profile.service,
      hint: "Choisissez votre métier principal",
    },
    {
      id: "ville",
      label: "Zone d'activité",
      done: !!(profile.ville || profile.localisation),
      hint: "Indiquez votre ville ou quartier",
    },
    {
      id: "description",
      label: "Description de votre activité",
      done: (profile.description?.trim().length ?? 0) > 20,
      hint: "Présentez-vous en quelques lignes",
    },
    {
      id: "tarif",
      label: "Tarif indicatif",
      done: (profile.prixprestataire ?? 0) > 0,
      hint: "Fixez un tarif de référence",
    },
    {
      id: "selfie",
      label: "Photo de profil",
      done: !!(profile.selfie || profile.photoProfil),
      hint: "Ajoutez une photo professionnelle",
    },
    {
      id: "verifier",
      label: "Profil vérifié",
      done: !!profile.verifier,
      hint: "Validation par l'équipe Soutrali",
    },
  ];

  const done = items.filter((i) => i.done).length;
  const total = items.length;
  return {
    score: done,
    total,
    percent: Math.round((done / total) * 100),
    items,
    isVisible: done >= 4,
  };
}

export function formatFcfa(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "decimal",
    maximumFractionDigits: 0,
  }).format(amount) + " FCFA";
}

export const STATUT_LABELS: Record<string, string> = {
  EN_ATTENTE: "En attente",
  ACCEPTEE: "Acceptée",
  CONFIRMEE: "Confirmée",
  EN_COURS: "En cours",
  TERMINEE: "Terminée",
  ANNULEE: "Annulée",
  REFUSEE: "Refusée",
};

export const STATUT_VARIANT: Record<
  string,
  "default" | "secondary" | "outline" | "success"
> = {
  EN_ATTENTE: "outline",
  CONFIRMEE: "outline",
  EN_COURS: "outline",
  TERMINEE: "outline",
  ANNULEE: "outline",
  REFUSEE: "outline",
};
