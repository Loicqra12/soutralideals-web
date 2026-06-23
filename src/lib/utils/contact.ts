/** Normalise un numéro pour tel: ou wa.me */
export function normalizePhone(raw?: string | null): string | null {
  if (!raw?.trim()) return null;
  const digits = raw.replace(/[^\d+]/g, "");
  return digits || null;
}

export function telHref(phone?: string | null): string | null {
  const normalized = normalizePhone(phone);
  return normalized ? `tel:${normalized}` : null;
}

export function whatsappHref(
  phone?: string | null,
  message?: string,
): string | null {
  const normalized = normalizePhone(phone);
  if (!normalized) return null;
  const digits = normalized.replace(/^\+/, "");
  const base = `https://wa.me/${digits}`;
  if (!message?.trim()) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}
