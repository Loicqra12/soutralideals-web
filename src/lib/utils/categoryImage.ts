/**
 * URL d'image catégorie (Cloudinary ou chemin backend).
 * Retourne null si absente — l'UI affiche alors une icône de repli.
 */
export function getCategoryImageUrl(
  imagecategorie?: string | null,
): string | null {
  if (!imagecategorie?.trim()) return null;

  const url = imagecategorie.trim();
  if (/^https?:\/\//i.test(url)) return url;

  const apiRoot =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") ??
    "http://127.0.0.1:3000";

  return url.startsWith("/") ? `${apiRoot}${url}` : `${apiRoot}/${url}`;
}
