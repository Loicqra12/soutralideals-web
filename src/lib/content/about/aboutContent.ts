/** Contenu aligné sur le pitch deck Soutrali Deals (site vitrine) */

export const ABOUT_VISION = {
  eyebrow: "Vision globale",
  title: "Vision globale de Soutrali Deals",
  subtitle: "Un écosystème complet pour l'économie informelle",
  paragraphs: [
    "Soutrali Deals est une plateforme pensée pour structurer, connecter et faire grandir l'économie informelle en Côte d'Ivoire — et au-delà.",
    "Une plateforme, plusieurs solutions interconnectées pour artisans, freelances et consommateurs : marketplace, services géolocalisés, identification et paiement.",
    "Notre ambition : devenir la référence digitale des métiers informels et indépendants en Afrique de l'Ouest, avec des outils adaptés aux réalités locales (Mobile Money, géolocalisation, confiance digitale).",
  ],
} as const;

export const ABOUT_PROBLEM = {
  title: "Le constat",
  points: [
    {
      text: "Plus de 90 % des emplois en Côte d'Ivoire relèvent du secteur informel.",
      emphasis: ["90 %", "secteur informel"],
    },
    {
      text: "Artisans, freelances et commerçants manquent de structure, de visibilité digitale et de solutions de paiement modernes.",
      emphasis: ["visibilité digitale", "solutions de paiement modernes"],
    },
    {
      text: "Les clients peinent à trouver des prestataires fiables, comparer les offres et sécuriser les transactions.",
      emphasis: ["prestataires fiables", "sécuriser les transactions"],
    },
  ],
} as const;

export const ABOUT_MARKET = {
  title: "Le marché",
  stats: [
    { value: "1,5 M+", label: "prestataires informels actifs en CI", featured: true },
    { value: "15 M", label: "consommateurs urbains", featured: false },
    { value: "47 %", label: "du PIB — économie informelle", featured: true },
    { value: "67 %", label: "pénétration smartphone (2024)", featured: true },
  ],
  note: "Des réalités locales : Mobile Money, géolocalisation et confiance digitale.",
  noteEmphasis: ["Mobile Money", "géolocalisation", "confiance digitale"],
} as const;

export const ABOUT_SOLUTION = {
  title: "La solution Soutrali Deals",
  description:
    "Une plateforme web et mobile qui digitalise les compétences « invisibles », structure l'activité des prestataires et facilite l'accès aux clients via des outils simples et sécurisés.",
  features: [
    "Marketplace de services et produits",
    "Prestataires géolocalisés et profils vérifiés",
    "Commandes, avis et gestion d'activité",
    "App de recensement & identification (Soutrali ID)",
    "Paiement et wallet (SoutraPay — à venir)",
  ],
} as const;

export const ABOUT_ROADMAP = {
  eyebrow: "Feuille de route",
  title: "Une croissance par étapes",
  subtitle: "De la fondation locale à l'expansion régionale",
  intro:
    "Trois phases pour construire, consolider et déployer Soutrali Deals : des bases solides en Côte d'Ivoire, puis une montée en puissance vers l'Afrique de l'Ouest.",
} as const;

export const SOUTRALI_VALUES = [
  { letter: "S", title: "Service exceptionnel", acronym: "SEASOUTRALI", desc: "Service Exceptionnel Alliant SOUTRALI" },
  { letter: "O", title: "Originalité", acronym: "OASIS", desc: "Originalité Alliant Soutien et Innovation SOUTRALI" },
  { letter: "U", title: "Unicité", acronym: "USIS", desc: "Unicité et Stature Innovante SOUTRALI" },
  { letter: "T", title: "Technologie", acronym: "TIDES", desc: "Technologie Innovante et Développement SOUTRALI" },
  { letter: "R", title: "Réactivité", acronym: "REXIS", desc: "Réactivité et Excellence Inspirant SOUTRALI" },
  { letter: "A", title: "Agilité", acronym: "AALTITUDE", desc: "Agilité, longévité et transformation par la tech" },
  { letter: "L", title: "Leadership", acronym: "LUMINOS", desc: "Leadership unissant mission et innovation" },
  { letter: "I", title: "Innovation", acronym: "IGNIS", desc: "Innovation guidant notre identité SOUTRALI" },
] as const;
