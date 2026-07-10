import { resolveMediaUrl } from "@/lib/utils/mediaUrl";

/**
 * URL d'image service (Cloudinary ou chemin backend).
 * Retourne null si absente — l'UI affiche alors une icône de repli.
 */
export function getServiceImageUrl(imageservice?: string | null): string | null {
  return resolveMediaUrl(imageservice);
}
