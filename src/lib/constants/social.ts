/** Liens officiels — alignés sur le site de présentation (soutrali-deals) */

export const MARKETING_SITE_URL =
  process.env.NEXT_PUBLIC_MARKETING_URL?.trim() ||
  "https://soutralideals-web.onrender.com";

export const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/p/SoutraliDeals-61556925353967/",
  twitter: "https://x.com/SoutraliDeals",
  instagram: "https://www.instagram.com/soutrali_deals/",
  linkedin: "https://ci.linkedin.com/company/soutrali-deals",
  whatsappCommunity: "https://chat.whatsapp.com/JnPGnE5qAFPLTg5foFozm5",
  whatsappContact: "https://wa.me/2250700000000",
  email: "contact@soutralideals.com",
} as const;

export const FOOTER_SOCIAL_ITEMS = [
  {
    href: SOCIAL_LINKS.facebook,
    icon: "Facebook" as const,
    label: "Facebook",
    hover: "hover:border-blue-400/40 hover:text-blue-400",
  },
  {
    href: SOCIAL_LINKS.twitter,
    icon: "Twitter" as const,
    label: "X (Twitter)",
    hover: "hover:border-white/30 hover:text-white",
  },
  {
    href: SOCIAL_LINKS.instagram,
    icon: "Instagram" as const,
    label: "Instagram",
    hover: "hover:border-amber-400/50 hover:text-amber-400",
  },
  {
    href: SOCIAL_LINKS.linkedin,
    icon: "Linkedin" as const,
    label: "LinkedIn",
    hover: "hover:border-blue-400/50 hover:text-blue-400",
  },
  {
    href: SOCIAL_LINKS.whatsappCommunity,
    icon: "WhatsApp" as const,
    label: "Communauté WhatsApp",
    hover: "hover:border-emerald-400/50 hover:text-emerald-400",
  },
] as const;
