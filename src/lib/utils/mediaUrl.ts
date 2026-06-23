/**
 * URL média (Cloudinary ou chemin backend).
 */
export function resolveMediaUrl(url?: string | null): string | null {
  if (!url?.trim()) return null;

  const value = url.trim();
  if (/^https?:\/\//i.test(value)) return value;

  const apiRoot =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") ??
    "http://127.0.0.1:3000";

  return value.startsWith("/") ? `${apiRoot}${value}` : `${apiRoot}/${value}`;
}
