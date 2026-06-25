/**
 * Injecte un script JSON-LD pour le SEO (rich snippets Google).
 * Compatible avec les composants "use client" via dangerouslySetInnerHTML.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
