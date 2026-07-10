import { resolveMediaUrl } from "@/lib/utils/mediaUrl";

/**
 * URL d'image catégorie (Cloudinary ou chemin backend).
 * Retourne null si absente — l'UI affiche alors une icône de repli.
 */
export function getCategoryImageUrl(
  imagecategorie?: string | null,
): string | null {
  return resolveMediaUrl(imagecategorie);
}
