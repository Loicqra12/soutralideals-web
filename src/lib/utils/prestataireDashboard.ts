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
      id: "gps",
      label: "Position GPS (obligatoire)",
      done: !!(
        profile.localisationmaps?.latitude != null &&
        profile.localisationmaps?.longitude != null
      ),
      hint: "Requis pour être visible sur la marketplace",
    },
    {
      id: "cni",
      label: "CNI recto + verso (badge Vérifié)",
      done: !!(profile.cni1 && profile.cni2),
      hint: "Optionnel — permet d'obtenir le badge « Identité vérifiée »",
    },
    {
      id: "selfie",
      label: "Photo selfie (badge Vérifié)",
      done: !!profile.selfie,
      hint: "Optionnel — complète la vérification d'identité",
    },
    {
      id: "verifier",
      label: "Badge « Identité vérifiée »",
      done: !!profile.verifier,
      hint: "Attribué après validation de la CNI par l'équipe Soutrali",
    },
  ];

  const done = items.filter((i) => i.done).length;
  const total = items.length;
  // Un profil est visible dès qu'il est "active", avec ou sans badge
  return {
    score: done,
    total,
    percent: Math.round((done / total) * 100),
    items,
    isVisible: profile.status === "active",
  };
}

export function formatFcfa(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "decimal",
    maximumFractionDigits: 0,
  }).format(amount) + " FCFA";
}

export const PRESTATAIRE_STATUS_LABELS: Record<string, string> = {
  incomplete: "Profil incomplet",
  pending: "En attente de validation",
  active: "Actif",
  rejected: "Rejeté",
  suspended: "Suspendu",
};

export function getPrestataireStatusMessage(
  status?: string,
  verifier?: boolean,
): { tone: "warning" | "info" | "success" | "error"; message: string } {
  if (status === "active" && verifier) {
    return {
      tone: "success",
      message: "Votre profil est visible sur la marketplace avec le badge « Identité vérifiée ».",
    };
  }
  if (status === "active" && !verifier) {
    return {
      tone: "info",
      message:
        "Votre profil est visible sur la marketplace. Ajoutez votre CNI pour obtenir le badge « Identité vérifiée ».",
    };
  }
  if (status === "pending") {
    return {
      tone: "info",
      message:
        "Votre dossier est en cours de vérification par l'équipe Soutrali (24–48 h ouvrées).",
    };
  }
  if (status === "rejected") {
    return {
      tone: "error",
      message: "Votre profil a été rejeté. Contactez le support pour en savoir plus.",
    };
  }
  return {
    tone: "warning",
    message:
      "Définissez votre zone GPS pour soumettre votre profil. La CNI est optionnelle (badge seulement).",
  };
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
