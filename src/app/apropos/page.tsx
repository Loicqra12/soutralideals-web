import { createPageMetadata } from "@/lib/seo/metadata";
import { AboutPageContent } from "@/components/about/AboutPageContent";

export const metadata = createPageMetadata({
  title: "À propos",
  description:
    "Vision, équipe et feuille de route de Soutrali Deals : écosystème digital pour l'économie informelle en Côte d'Ivoire.",
  path: "/apropos",
});

export default function AproposPage() {
  return <AboutPageContent />;
}
