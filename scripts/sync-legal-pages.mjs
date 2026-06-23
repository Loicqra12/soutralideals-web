import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const srcLegal = join(root, "..", "soutrali-deals", "src", "pages", "legal");
const srcPages = join(root, "..", "soutrali-deals", "src", "pages");

const map = {
  "MentionsLegalesPage.tsx": "mentions-legales",
  "CGUPage.tsx": "cgu",
  "CGVPage.tsx": "cgv",
  "ConfidentialitePage.tsx": "confidentialite",
  "CookiesPage.tsx": "cookies",
  "AccessibilitePage.tsx": "accessibilite",
};

const meta = {
  "mentions-legales": {
    title: "Mentions légales",
    description:
      "Identité de l'éditeur, hébergement et propriété intellectuelle de Soutrali Deals.",
  },
  cgu: {
    title: "Conditions Générales d'Utilisation",
    description: "CGU de la plateforme Soutrali Deals — règles d'utilisation et responsabilités.",
  },
  cgv: {
    title: "Conditions Générales de Vente",
    description: "CGV Soutrali Deals — ventes, livraisons, retours et paiements.",
  },
  confidentialite: {
    title: "Politique de confidentialité",
    description: "Traitement et protection des données personnelles sur Soutrali Deals.",
  },
  cookies: {
    title: "Politique de cookies",
    description: "Types de cookies utilisés et gestion de vos préférences.",
  },
  accessibilite: {
    title: "Déclaration d'accessibilité",
    description: "Engagement et niveau de conformité WCAG de Soutrali Deals.",
  },
};

for (const [file, route] of Object.entries(map)) {
  let content = readFileSync(join(srcLegal, file), "utf8");
  content = content.replace(
    /from '\.\.\/\.\.\/components\/legal\/LegalLayout'/,
    "from '@/components/legal/LegalLayout'",
  );
  content = content.replace(/primary-blue/g, "primary-500");
  content = content.replace(/text-white\/55/g, "text-neutral-400");
  content = content.replace(/text-white\/70/g, "text-neutral-300");

  const m = meta[route];
  const header = `import { createPageMetadata } from "@/lib/seo/metadata";
import {
  LegalLayout,
  LegalArticle,
  LegalCallout,
  LegalTable,
  LegalList,
  LegalStrong,
} from "@/components/legal/LegalLayout";

export const metadata = createPageMetadata({
  title: ${JSON.stringify(m.title)},
  description: ${JSON.stringify(m.description)},
  path: "/${route}",
});

`;

  content = content.replace(
    /import \{[\s\S]*?\} from '@\/components\/legal\/LegalLayout';\n\n/,
    "",
  );

  const outDir = join(root, "src", "app", route);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "page.tsx"), header + content, "utf8");
  console.log("Wrote", route);
}

// Informations légales hub
const hubSrc = readFileSync(join(srcPages, "InformationsLegalesPage.tsx"), "utf8");
let hub = hubSrc
  .replace(/import { SEO } from '\.\.\/components\/seo\/SEO';\n/, "")
  .replace(/import { Link } from 'react-router-dom';/, 'import Link from "next/link";')
  .replace(/export const InformationsLegalesPage = \(\) => \{/, "export default function InformationsLegalesPage() {")
  .replace(/<>\s*<SEO[\s\S]*?\/>\s*/, "")
  .replace(/to=\{/g, "href={")
  .replace(/to="/g, 'href="')
  .replace(/primary-blue/g, "primary-500")
  .replace(/text-primary-blue/g, "text-primary-400")
  .replace(/border-primary-blue/g, "border-primary-500")
  .replace(/bg-primary-blue/g, "bg-primary-600")
  .replace(/container-custom/g, "mx-auto max-w-7xl px-4 lg:px-8")
  .replace(/text-text-secondary/g, "text-neutral-400")
  .replace(/border-dark-border/g, "border-neutral-800")
  .replace(/from-dark-card to-dark-bg/g, "from-neutral-900 to-neutral-950")
  .replace(/pt-24/g, "pt-8");

hub =
  `import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Informations légales",
  description: "Portail juridique Soutrali Deals : CGU, CGV, confidentialité, cookies et accessibilité.",
  path: "/informations-legales",
});

` + hub.replace(/<\/>\s*\);\s*\};\s*$/, "\n  );\n}\n");

mkdirSync(join(root, "src", "app", "informations-legales"), { recursive: true });
writeFileSync(join(root, "src", "app", "informations-legales", "page.tsx"), hub, "utf8");
console.log("Wrote informations-legales");
