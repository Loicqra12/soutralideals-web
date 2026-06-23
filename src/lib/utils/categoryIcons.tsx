import {
  Scissors,
  Wrench,
  Zap,
  UtensilsCrossed,
  Paintbrush,
  HardHat,
  Sparkles,
  Flower2,
  Laptop,
  Camera,
  Truck,
  Baby,
  Heart,
  Hammer,
  Car,
  GraduationCap,
  Music,
  Shirt,
  ShoppingBag,
  Package,
  Home,
  Dumbbell,
  Stethoscope,
  BookOpen,
  Tv,
  Coffee,
  Briefcase,
  Users,
  Palette,
  TrendingUp,
  Code2,
  PenTool,
  Globe,
  Megaphone,
  type LucideIcon,
} from "lucide-react";

interface IconConfig {
  icon: LucideIcon;
  color: string;
  bg: string;
}

const KEYWORD_MAP: Array<{ keywords: string[]; config: IconConfig }> = [
  {
    keywords: ["coiff", "cheveu", "salon", "barbier", "tresse", "ongles", "manucure"],
    config: { icon: Scissors, color: "text-pink-600", bg: "bg-pink-50" },
  },
  {
    keywords: ["plombier", "plomberie", "eau", "robinet", "tuyau"],
    config: { icon: Wrench, color: "text-blue-600", bg: "bg-blue-50" },
  },
  {
    keywords: ["électric", "electric", "courant", "câble", "panneau"],
    config: { icon: Zap, color: "text-yellow-600", bg: "bg-yellow-50" },
  },
  {
    keywords: ["cuisin", "traiteur", "chef", "restaur", "repas", "alimentation"],
    config: { icon: UtensilsCrossed, color: "text-orange-600", bg: "bg-orange-50" },
  },
  {
    keywords: ["peintur", "décor", "enduit", "revêtement"],
    config: { icon: Paintbrush, color: "text-purple-600", bg: "bg-purple-50" },
  },
  {
    keywords: ["maçon", "mason", "béton", "construction", "bâtiment", "carrelage"],
    config: { icon: HardHat, color: "text-stone-600", bg: "bg-stone-50" },
  },
  {
    keywords: ["nettoyage", "menage", "ménage", "entretien", "propre", "cleaning"],
    config: { icon: Sparkles, color: "text-cyan-600", bg: "bg-cyan-50" },
  },
  {
    keywords: ["jardin", "paysage", "plante", "gazon", "fleur", "agriculture"],
    config: { icon: Flower2, color: "text-green-600", bg: "bg-green-50" },
  },
  {
    keywords: ["inform", "ordinateur", "réseau", "serveur", "technicien"],
    config: { icon: Laptop, color: "text-indigo-600", bg: "bg-indigo-50" },
  },
  {
    keywords: ["photo", "vidéo", "video", "film", "cinéma"],
    config: { icon: Camera, color: "text-rose-600", bg: "bg-rose-50" },
  },
  {
    keywords: ["transport", "déménag", "livraison", "chauffeur", "taxi"],
    config: { icon: Truck, color: "text-amber-600", bg: "bg-amber-50" },
  },
  {
    keywords: ["enfant", "garde", "crèche", "baby", "puéricult"],
    config: { icon: Baby, color: "text-pink-500", bg: "bg-pink-50" },
  },
  {
    keywords: ["santé", "sante", "médic", "medic", "soins", "infirm"],
    config: { icon: Stethoscope, color: "text-red-600", bg: "bg-red-50" },
  },
  {
    keywords: ["menuisier", "menuiserie", "bois", "ébénist", "charpente"],
    config: { icon: Hammer, color: "text-orange-700", bg: "bg-orange-50" },
  },
  {
    keywords: ["auto", "mécanic", "garage", "voiture", "moto", "véhicule"],
    config: { icon: Car, color: "text-slate-600", bg: "bg-slate-50" },
  },
  {
    keywords: ["cours", "formation", "éducation", "education", "enseignement", "tuteur"],
    config: { icon: GraduationCap, color: "text-blue-700", bg: "bg-blue-50" },
  },
  {
    keywords: ["musique", "chant", "dj", "sonorisation", "événement"],
    config: { icon: Music, color: "text-violet-600", bg: "bg-violet-50" },
  },
  {
    keywords: ["couture", "mode", "vêtement", "vetement", "tailleur"],
    config: { icon: Shirt, color: "text-fuchsia-600", bg: "bg-fuchsia-50" },
  },
  {
    keywords: ["vente", "commerce", "boutique", "magasin", "shop"],
    config: { icon: ShoppingBag, color: "text-emerald-600", bg: "bg-emerald-50" },
  },
  {
    keywords: ["immobilier", "logement", "maison", "appartement", "terrain"],
    config: { icon: Home, color: "text-teal-600", bg: "bg-teal-50" },
  },
  {
    keywords: ["sport", "fitness", "gym", "coach", "musculation"],
    config: { icon: Dumbbell, color: "text-lime-600", bg: "bg-lime-50" },
  },
  // Freelance
  {
    keywords: ["développ", "develop", "web", "mobile", "code", "programmation"],
    config: { icon: Code2, color: "text-indigo-600", bg: "bg-indigo-50" },
  },
  {
    keywords: ["design", "graphique", "ui", "ux", "logo", "identité"],
    config: { icon: PenTool, color: "text-purple-600", bg: "bg-purple-50" },
  },
  {
    keywords: ["marketing", "publicité", "comm", "réseau social", "social media"],
    config: { icon: Megaphone, color: "text-orange-600", bg: "bg-orange-50" },
  },
  {
    keywords: ["rédact", "content", "texte", "traduction", "copywrite"],
    config: { icon: BookOpen, color: "text-amber-600", bg: "bg-amber-50" },
  },
  {
    keywords: ["gestion", "conseil", "consultant", "audit", "stratégie"],
    config: { icon: Briefcase, color: "text-slate-600", bg: "bg-slate-50" },
  },
  // E-marché
  {
    keywords: ["électronique", "electronique", "téléphone", "telephone", "tv", "écran"],
    config: { icon: Tv, color: "text-blue-600", bg: "bg-blue-50" },
  },
  {
    keywords: ["produit", "article", "bien"],
    config: { icon: Package, color: "text-neutral-600", bg: "bg-neutral-50" },
  },
];

const DEFAULT_CONFIG: IconConfig = {
  icon: Package,
  color: "text-primary-600",
  bg: "bg-primary-50",
};

export function getCategoryIconConfig(categoryName: string): IconConfig {
  const name = categoryName.toLowerCase();
  for (const { keywords, config } of KEYWORD_MAP) {
    if (keywords.some((kw) => name.includes(kw))) return config;
  }
  return DEFAULT_CONFIG;
}

export type { IconConfig };
