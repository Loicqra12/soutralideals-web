import Link from "next/link";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Plan du site",
  description: "Navigation complète de la marketplace Soutrali Deals.",
  path: "/plan-du-site",
  noIndex: true,
});

const groups = [
  {
    title: "Marketplace",
    links: [
      { href: "/", label: "Accueil" },
      { href: "/prestataires", label: "Prestataires & métiers" },
      { href: "/freelance", label: "Freelance" },
      { href: "/emarche", label: "E-marché" },
      { href: "/recherche", label: "Recherche" },
      { href: "/panier", label: "Panier" },
    ],
  },
  {
    title: "Compte & pros",
    links: [
      { href: "/connexion", label: "Connexion" },
      { href: "/inscription", label: "Inscription" },
      { href: "/prestataire/inscription", label: "Devenir prestataire" },
      { href: "/freelance/inscription", label: "Devenir freelance" },
      { href: "/emarche/inscription", label: "Ouvrir une boutique" },
      { href: "/prestataire/dashboard", label: "Espace prestataire" },
      { href: "/profile", label: "Mon profil" },
    ],
  },
  {
    title: "Institutionnel & légal",
    links: [
      { href: "/apropos", label: "À propos" },
      { href: "/informations-legales", label: "Portail légal" },
      { href: "/mentions-legales", label: "Mentions légales" },
      { href: "/cgu", label: "CGU" },
      { href: "/cgv", label: "CGV" },
      { href: "/confidentialite", label: "Confidentialité" },
      { href: "/cookies", label: "Cookies" },
      { href: "/accessibilite", label: "Accessibilité" },
      { href: "/plan-du-site", label: "Plan du site" },
    ],
  },
];

export default function PlanDuSitePage() {
  return (
    <div className="border-b border-neutral-800 bg-gradient-to-b from-neutral-900 to-neutral-950 py-12">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary-500/80">
          Navigation
        </p>
        <h1 className="text-4xl font-bold text-white md:text-5xl">Plan du site</h1>
        <p className="mt-4 max-w-2xl text-neutral-400">
          Accédez rapidement aux pages de la marketplace Soutrali Deals.
        </p>

        <div className="mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <div
              key={group.title}
              className="rounded-2xl border border-neutral-800 bg-neutral-950/80 p-6"
            >
              <h2 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary-500/70">
                {group.title}
              </h2>
              <ul className="space-y-3 text-sm text-neutral-400">
                {group.links.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="transition hover:text-white hover:underline"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
