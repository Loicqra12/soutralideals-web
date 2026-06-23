import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/metadata";

const STATIC_ROUTES: {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"];
}[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/prestataires", priority: 0.9, changeFrequency: "daily" },
  { path: "/freelance", priority: 0.9, changeFrequency: "daily" },
  { path: "/emarche", priority: 0.9, changeFrequency: "daily" },
  { path: "/recherche", priority: 0.7, changeFrequency: "weekly" },
  { path: "/apropos", priority: 0.6, changeFrequency: "yearly" },
  { path: "/connexion", priority: 0.4, changeFrequency: "yearly" },
  { path: "/inscription", priority: 0.5, changeFrequency: "yearly" },
  { path: "/prestataire/inscription", priority: 0.6, changeFrequency: "monthly" },
  { path: "/freelance/inscription", priority: 0.6, changeFrequency: "monthly" },
  { path: "/emarche/inscription", priority: 0.6, changeFrequency: "monthly" },
  { path: "/informations-legales", priority: 0.3, changeFrequency: "yearly" },
  { path: "/mentions-legales", priority: 0.2, changeFrequency: "yearly" },
  { path: "/cgu", priority: 0.2, changeFrequency: "yearly" },
  { path: "/cgv", priority: 0.2, changeFrequency: "yearly" },
  { path: "/confidentialite", priority: 0.2, changeFrequency: "yearly" },
  { path: "/cookies", priority: 0.2, changeFrequency: "yearly" },
  { path: "/accessibilite", priority: 0.2, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return STATIC_ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
