import type { LucideIcon } from "lucide-react";
import { Laptop, ShoppingBag, Wrench } from "lucide-react";

export type ProRole = "PRESTATAIRE" | "FREELANCE" | "VENDEUR";

export interface ProInscriptionOption {
  role: ProRole;
  href: string;
  dashboardHref: string;
  dashboardLabel: string;
  label: string;
  description: string;
  icon: LucideIcon;
}

export const PRO_INSCRIPTION_OPTIONS: ProInscriptionOption[] = [
  {
    role: "PRESTATAIRE",
    href: "/prestataire/inscription",
    label: "Devenir prestataire",
    dashboardHref: "/prestataire/dashboard",
    dashboardLabel: "Mon espace prestataire",
    description: "Artisans, techniciens, services à domicile.",
    icon: Wrench,
  },
  {
    role: "FREELANCE",
    href: "/freelance/inscription",
    label: "Devenir freelance",
    dashboardHref: "/freelance/espace",
    dashboardLabel: "Mon espace freelance",
    description: "Développeurs, designers, consultants digitaux.",
    icon: Laptop,
  },
  {
    role: "VENDEUR",
    href: "/emarche/inscription",
    label: "Ouvrir une boutique",
    dashboardHref: "/emarche/espace",
    dashboardLabel: "Ma boutique",
    description: "Vendeurs, artisans et produits locaux en ligne.",
    icon: ShoppingBag,
  },
];

export function resolveProHref(
  option: ProInscriptionOption,
  hasRole: (role: string) => boolean,
): { href: string; label: string } {
  const isPro = hasRole(option.role);
  return {
    href: isPro ? option.dashboardHref : option.href,
    label: isPro ? option.dashboardLabel : option.label,
  };
}
