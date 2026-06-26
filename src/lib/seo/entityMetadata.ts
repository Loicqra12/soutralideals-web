import type { Metadata } from "next";
import { serverFetch } from "@/lib/api/serverFetch";
import { createPageMetadata } from "@/lib/seo/metadata";
import {
  getCategoryLabel,
  getServiceLabel,
  getUtilisateurDisplayName,
} from "@/lib/utils/listingDisplay";
import type { Article, Freelance, Prestataire } from "@/types";

function truncate(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length <= max ? clean : `${clean.slice(0, max - 1)}…`;
}

export async function prestataireMetadata(id: string): Promise<Metadata> {
  const path = `/prestataires/${id}`;
  const prestataire = await serverFetch<Prestataire>(`/prestataire/${id}`);

  if (!prestataire) {
    return createPageMetadata({
      title: "Prestataire",
      description: "Fiche prestataire sur Soutrali Deals — Côte d'Ivoire.",
      path,
    });
  }

  const name = getUtilisateurDisplayName(
    prestataire.nom,
    prestataire.prenom,
    prestataire.utilisateur,
  );
  const service =
    getServiceLabel(prestataire.service) ??
    getCategoryLabel(prestataire.categorie, prestataire.service) ??
    "Prestataire";
  const ville = prestataire.ville ?? prestataire.localisation;
  const desc = prestataire.description
    ? truncate(prestataire.description)
    : `${name}, ${service}${ville ? ` à ${ville}` : ""} — contactez ce professionnel sur Soutrali Deals.`;

  return createPageMetadata({ title: name, description: desc, path });
}

export async function freelanceMetadata(id: string): Promise<Metadata> {
  const path = `/freelance/${id}`;
  const freelance = await serverFetch<Freelance>(`/freelance/${id}`);

  if (!freelance) {
    return createPageMetadata({
      title: "Freelance",
      description: "Profil freelance sur Soutrali Deals — Côte d'Ivoire.",
      path,
    });
  }

  const name =
    freelance.name ??
    getUtilisateurDisplayName(
      freelance.nom,
      freelance.prenom,
      freelance.utilisateur,
      "Freelance",
    );
  const job =
    freelance.job ??
    getServiceLabel(freelance.service) ??
    getCategoryLabel(freelance.categorie, freelance.service) ??
    "Freelance";
  const ville = freelance.location ?? freelance.ville;
  const desc = freelance.description
    ? truncate(freelance.description)
    : `${name}, ${job}${ville ? ` — ${ville}` : ""}. Trouvez ce freelance sur Soutrali Deals.`;

  return createPageMetadata({ title: name, description: desc, path });
}

export async function articleMetadata(id: string): Promise<Metadata> {
  const path = `/emarche/${id}`;
  const article = await serverFetch<Article>(`/article/${id}`);

  if (!article) {
    return createPageMetadata({
      title: "Article",
      description: "Produit E-marché sur Soutrali Deals — Côte d'Ivoire.",
      path,
    });
  }

  const desc = article.description
    ? truncate(article.description)
    : `${article.nomArticle} — achetez sur l'E-marché Soutrali Deals.`;

  return createPageMetadata({
    title: article.nomArticle,
    description: desc,
    path,
  });
}
