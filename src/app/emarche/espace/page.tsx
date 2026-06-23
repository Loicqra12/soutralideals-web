"use client";

import Link from "next/link";
import { Package, ShoppingBag, Star, Store } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProIcon, ProIconBox } from "@/components/prestataire/ProIcon";
import { useMyVendeur } from "@/lib/hooks/useMyVendeur";
import { useArticles } from "@/lib/hooks/useArticles";
import { useAuthStore } from "@/stores";
import { useMemo } from "react";
import type { Article } from "@/types";

function getVendeurId(article: Article): string | undefined {
  const v = article.vendeur;
  if (!v) return undefined;
  return typeof v === "string" ? v : v._id;
}

export default function EmarcheEspacePage() {
  const utilisateur = useAuthStore((s) => s.utilisateur);
  const { data: shop, isLoading: shopLoading } = useMyVendeur();
  const { data: articles, isLoading: articlesLoading } = useArticles();

  const myArticles = useMemo(() => {
    if (!shop?._id || !articles) return [];
    return articles.filter((a) => getVendeurId(a) === shop._id);
  }, [articles, shop?._id]);

  const inStock = myArticles.filter(
    (a) => (a.quantiteArticle ?? 0) > 0,
  ).length;

  if (shopLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="h-64 animate-pulse rounded-xl bg-neutral-200" />
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <p className="text-neutral-600">
          Aucune boutique trouvée pour ce compte.
        </p>
        <Button className="mt-4" asChild>
          <Link href="/emarche/inscription">Ouvrir ma boutique</Link>
        </Button>
      </div>
    );
  }

  const shopName = shop.shopName ?? shop.nom ?? "Ma boutique";

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 lg:px-8 lg:py-8">
      <div className="mb-8 overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <div className="border-b border-neutral-100 px-6 py-6 sm:px-8">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            E-marché vendeur
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-neutral-900 sm:text-3xl">
            Bonjour{utilisateur?.prenom ? `, ${utilisateur.prenom}` : ""}
          </h1>
          <p className="mt-2 text-neutral-600">{shopName}</p>
          {shop.shopDescription && (
            <p className="mt-2 line-clamp-2 text-sm text-neutral-500">
              {shop.shopDescription}
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            {shop.verifier && (
              <Badge variant="outline">Boutique vérifiée</Badge>
            )}
            {shop.ville && <Badge variant="outline">{shop.ville}</Badge>}
          </div>
        </div>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card className="border-neutral-200 shadow-sm">
          <CardContent className="flex items-center gap-3 p-5">
            <ProIconBox>
              <ProIcon icon={Package} size={18} />
            </ProIconBox>
            <div>
              <p className="text-xs text-neutral-500">Produits publiés</p>
              <p className="text-lg font-semibold text-neutral-900">
                {articlesLoading ? "…" : myArticles.length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 shadow-sm">
          <CardContent className="flex items-center gap-3 p-5">
            <ProIconBox>
              <ProIcon icon={Store} size={18} />
            </ProIconBox>
            <div>
              <p className="text-xs text-neutral-500">En stock</p>
              <p className="text-lg font-semibold text-neutral-900">
                {articlesLoading ? "…" : inStock}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 shadow-sm">
          <CardContent className="flex items-center gap-3 p-5">
            <ProIconBox>
              <ProIcon icon={Star} size={18} />
            </ProIconBox>
            <div>
              <p className="text-xs text-neutral-500">Note boutique</p>
              <p className="text-lg font-semibold text-neutral-900">
                {shop.rating != null && shop.rating > 0
                  ? shop.rating.toFixed(1)
                  : "—"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-neutral-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Mes produits</CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link href="/emarche">
              <ShoppingBag className="mr-1 h-4 w-4" />
              Voir l&apos;E-marché
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {articlesLoading ? (
            <div className="h-24 animate-pulse rounded-lg bg-neutral-100" />
          ) : myArticles.length === 0 ? (
            <p className="text-sm text-neutral-500">
              Aucun produit associé à votre boutique pour le moment. La
              publication de produits depuis le web arrive prochainement.
            </p>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {myArticles.slice(0, 8).map((article) => (
                <li
                  key={article._id}
                  className="flex items-center justify-between py-3 text-sm"
                >
                  <span className="font-medium text-neutral-900">
                    {article.nomArticle}
                  </span>
                  <span className="text-neutral-500">
                    Stock : {article.quantiteArticle ?? 0}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
