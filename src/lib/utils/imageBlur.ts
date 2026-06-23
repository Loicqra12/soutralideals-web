/**
 * Génère un data URL shimmer SVG pour le blur placeholder Next.js Image.
 * Utilisé comme blurDataURL sur toutes les images.
 */
export function shimmerBlur(w = 8, h = 6): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <rect width="${w}" height="${h}" fill="#f3f4f6"/>
    <rect width="${w}" height="${h}" fill="url(#g)"/>
    <defs>
      <linearGradient id="g" x1="0" x2="1" y1="0" y2="0">
        <stop offset="20%" stop-color="#f3f4f6"/>
        <stop offset="50%" stop-color="#e5e7eb"/>
        <stop offset="70%" stop-color="#f3f4f6"/>
      </linearGradient>
    </defs>
  </svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

/** Placeholder vert clair pour les images de prestataires */
export const BLUR_PRESTATAIRE =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

/** Placeholder neutre générique */
export const BLUR_DEFAULT =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAGCAYAAAD+Bd/7AAAAFUlEQVR42mNk+M9Qz0AEYBxVSF+FABJaAl2ENF4OAAAAAElFTkSuQmCC";
