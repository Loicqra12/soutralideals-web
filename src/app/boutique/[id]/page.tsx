import type { Metadata } from "next";
import { BoutiqueDetailClient } from "./BoutiqueDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";
  try {
    const res = await fetch(`${apiUrl}/vendeur/${id}`, { next: { revalidate: 300 } });
    if (res.ok) {
      const shop = await res.json();
      const name = shop.shopName ?? shop.nom ?? "Boutique";
      return {
        title: `${name} — Soutrali Deals`,
        description: shop.shopDescription ?? `Découvrez la boutique ${name} sur Soutrali Deals.`,
      };
    }
  } catch {}
  return { title: "Boutique — Soutrali Deals" };
}

export default async function BoutiquePage({ params }: Props) {
  const { id } = await params;
  return <BoutiqueDetailClient id={id} />;
}
