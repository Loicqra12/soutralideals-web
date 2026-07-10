const ALLOWED_REMOTE_HOSTS = new Set(["res.cloudinary.com"]);

const BLOCKED_REMOTE_HOSTS = new Set([
  "via.placeholder.com",
  "placehold.co",
]);

function getApiRoot(): string {
  return (
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") ??
    "http://127.0.0.1:3000"
  );
}

function getApiHostname(): string | null {
  try {
    return new URL(getApiRoot()).hostname;
  } catch {
    return null;
  }
}

/** Hôtes autorisés pour `next/image` (aligné sur next.config remotePatterns + API). */
function isRemoteUrlAllowed(url: string): boolean {
  try {
    const { hostname, protocol } = new URL(url);
    if (protocol !== "http:" && protocol !== "https:") return false;
    if (BLOCKED_REMOTE_HOSTS.has(hostname)) return false;
    if (ALLOWED_REMOTE_HOSTS.has(hostname)) return true;

    const apiHost = getApiHostname();
    if (apiHost && hostname === apiHost) return true;

    return hostname === "localhost" || hostname === "127.0.0.1";
  } catch {
    return false;
  }
}

/**
 * URL média (Cloudinary ou chemin backend).
 * Retourne null si l'URL n'est pas utilisable avec `next/image`.
 */
export function resolveMediaUrl(url?: string | null): string | null {
  if (!url?.trim()) return null;

  const value = url.trim();
  const resolved = /^https?:\/\//i.test(value)
    ? value
    : value.startsWith("/")
      ? `${getApiRoot()}${value}`
      : `${getApiRoot()}/${value}`;

  return isRemoteUrlAllowed(resolved) ? resolved : null;
}
