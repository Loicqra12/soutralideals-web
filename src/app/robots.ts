import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/metadata";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/prestataire/dashboard", "/prestataire/missions", "/profile", "/settings", "/panier"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
