import type { Metadata } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ??
  "http://localhost:3001";

export function createPageMetadata({
  title,
  description,
  path,
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
}): Metadata {
  const url = `${SITE_URL}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: `${title} | Soutrali Deals`,
      description,
      url,
      locale: "fr_FR",
      type: "website",
      images: [{ url: "/og-default.png" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Soutrali Deals`,
      description,
      images: ["/og-default.png"],
    },
  };
}

export { SITE_URL };
