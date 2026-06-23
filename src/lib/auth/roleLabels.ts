const ROLE_LABELS: Record<string, string> = {
  CLIENT: "Client",
  PRESTATAIRE: "Prestataire",
  FREELANCE: "Freelance",
  VENDEUR: "Vendeur",
  ADMIN: "Administrateur",
};

const ROLE_DASHBOARD: Record<string, { href: string; label: string }> = {
  CLIENT: { href: "/", label: "Mode client" },
  PRESTATAIRE: { href: "/prestataire/dashboard", label: "Espace prestataire" },
  FREELANCE: { href: "/freelance/espace", label: "Espace freelance" },
  VENDEUR: { href: "/emarche/espace", label: "Ma boutique" },
};

export function getRoleLabel(role: string): string {
  return ROLE_LABELS[role.toUpperCase()] ?? role;
}

export function getRoleDashboard(role: string) {
  return ROLE_DASHBOARD[role.toUpperCase()] ?? null;
}

export const PRO_ROLES = ["PRESTATAIRE", "FREELANCE", "VENDEUR"] as const;
