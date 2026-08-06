"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft, ShoppingBag, Star, MapPin, Phone, Mail,
  Globe, AlertCircle, Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArticleCard } from "@/components/emarche/ArticleCard";
import { EntityImage } from "@/components/shared/EntityImage";
import { CardSkeletonGrid } from "@/components/shared/CardSkeleton";
import { fetchVendeurById } from "@/lib/api/vendeurs";
import { fetchArticles } from "@/lib/api/articles";
import { formatPriceFCFA } from "@/lib/utils/format";

interface Props {
  id: string;
}

export function BoutiqueDetailClient({ id }: Props) {
  const {
    data: shop,
    isLoading: shopLoading,
    error: shopError,
  } = useQuery({
    queryKey: ["vendeur", id],
    queryFn: () => fetchVendeurById(id),
    staleTime: 5 * 60 * 1000,
  });

  const { data: allArticles = [], isLoading: articlesLoading } = useQuery({
    queryKey: ["articles"],
    queryFn: fetchArticles,
    staleTime: 5 * 60 * 1000,
  });

  const articles = allArticles.filter((a) => {
    const v = a.vendeur;
    return (typeof v === "string" ? v : v?._id) === id;
  });

  if (shopLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="mb-8 h-40 animate-pulse rounded-2xl bg-neutral-200" />
        <CardSkeletonGrid count={8} />
      </div>
    );
  }

  if (shopError || !shop) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-neutral-300" />
        <p className="mt-4 text-lg font-semibold text-neutral-900">Boutique introuvable</p>
        <p className="mt-2 text-sm text-neutral-500">
          Cette boutique n&apos;existe pas ou a été supprimée.
        </p>
        <Button className="mt-6" asChild>
          <Link href="/emarche">Retour à l&apos;E-marché</Link>
        </Button>
      </div>
    );
  }

  const shopName = shop.shopName ?? shop.nom ?? "Boutique";

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
        <Button variant="ghost" size="sm" asChild className="mb-6 -ml-2">
          <Link href="/emarche">
            <ArrowLeft className="mr-2 h-4 w-4" /> E-marché
          </Link>
        </Button>

        {/* Entête boutique */}
        <div className="mb-8 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <div className="flex items-start gap-5 p-6 sm:p-8">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-neutral-100 bg-neutral-100">
              <EntityImage
                src={shop.shopLogo ?? shop.photoProfil}
                alt={shopName}
                sizes="80px"
                className="object-cover"
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl">{shopName}</h1>
                {shop.verifier && (
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
                    Vérifiée
                  </Badge>
                )}
              </div>

              {shop.shopDescription && (
                <p className="mt-2 text-sm text-neutral-600 line-clamp-3">{shop.shopDescription}</p>
              )}

              <div className="mt-3 flex flex-wrap gap-4 text-sm text-neutral-500">
                {shop.ville && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {shop.ville}
                  </span>
                )}
                {shop.rating != null && shop.rating > 0 && (
                  <span className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    {shop.rating.toFixed(1)}
                  </span>
                )}
                {shop.businessPhone && (
                  <a
                    href={`tel:${shop.businessPhone}`}
                    className="flex items-center gap-1 hover:text-primary-600"
                  >
                    <Phone className="h-3.5 w-3.5" /> {shop.businessPhone}
                  </a>
                )}
                {shop.businessEmail && (
                  <a
                    href={`mailto:${shop.businessEmail}`}
                    className="flex items-center gap-1 hover:text-primary-600"
                  >
                    <Mail className="h-3.5 w-3.5" /> {shop.businessEmail}
                  </a>
                )}
                {shop.socialMedia?.website && (
                  <a
                    href={shop.socialMedia.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-primary-600"
                  >
                    <Globe className="h-3.5 w-3.5" /> Site web
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Catalogue */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900">
            Produits{" "}
            {!articlesLoading && (
              <span className="ml-1 text-sm font-normal text-neutral-500">
                ({articles.length})
              </span>
            )}
          </h2>
        </div>

        {articlesLoading ? (
          <CardSkeletonGrid count={8} />
        ) : articles.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <ShoppingBag className="h-12 w-12 text-neutral-200" />
            <p className="text-sm text-neutral-500">Cette boutique n&apos;a pas encore de produits.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {articles.map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
