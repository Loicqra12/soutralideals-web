"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { Star } from "lucide-react";
import { LocalSearchInput } from "@/components/shared/LocalSearchInput";
import { useArticles } from "@/lib/hooks/useArticles";
import { useVendeurs } from "@/lib/hooks/useVendeurs";
import { useCategoriesByPole } from "@/lib/hooks/useCategories";
import { ArticleCard } from "@/components/emarche/ArticleCard";
import { CategoryScroll } from "@/components/home/CategoryScroll";
import { ArticleSkeletonGrid } from "@/components/shared/CardSkeleton";
import { AnimatedGrid, AnimatedItem } from "@/components/shared/AnimatedGrid";
import { Badge } from "@/components/ui/badge";
import { matchesCategoryFilter } from "@/lib/utils/listingDisplay";

function EmarcheContent() {
  const searchParams = useSearchParams();
  const categorieParam = searchParams.get("categorie") ?? "";
  const q = searchParams.get("q") ?? "";
  const [search, setSearch] = useState(q || categorieParam);

  const { data: categories, isLoading: loadingCategories } = useCategoriesByPole("emarche");
  const { data: articles, isLoading: loadingArticles } = useArticles();
  const { data: vendeurs, isLoading: loadingVendeurs } = useVendeurs();

  const filteredArticles = useMemo(() => {
    return (articles ?? []).filter((article) => {
      if (categorieParam && !matchesCategoryFilter(article.categorie, undefined, categorieParam))
        return false;
      if (!search.trim()) return true;
      const term = search.toLowerCase();
      return (
        article.nomArticle.toLowerCase().includes(term) ||
        (article.description?.toLowerCase().includes(term) ?? false)
      );
    });
  }, [articles, categorieParam, search]);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            E-marché
          </h1>
          <p className="mt-2 text-neutral-500">
            Produits locaux auprès de vendeurs vérifiés en Côte d&apos;Ivoire.
          </p>

          <div className="mt-6 max-w-lg">
            <LocalSearchInput
              value={search}
              onChange={(v) => setSearch(v)}
              placeholder="Robe, chaussures, alimentaire…"
              accentColor="purple"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        {/* Categories */}
        <div className="mb-8">
          <CategoryScroll pole="emarche" isLoading={loadingCategories} categories={categories} />
        </div>

        {/* Products */}
        <section className="mb-14">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-neutral-900">Produits</h2>
            {!loadingArticles && filteredArticles.length > 0 && (
              <p className="text-sm text-neutral-500">
                {filteredArticles.length} produit{filteredArticles.length > 1 ? "s" : ""}
              </p>
            )}
          </div>

          {loadingArticles && <ArticleSkeletonGrid count={10} />}

          {!loadingArticles && filteredArticles.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-white py-16 text-center">
              <p className="font-semibold text-neutral-900">Aucun produit trouvé</p>
              <p className="mt-1 text-sm text-neutral-500">Essayez un autre mot-clé.</p>
            </div>
          )}

          {!loadingArticles && filteredArticles.length > 0 && (
            <AnimatedGrid className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {filteredArticles.map((article, i) => (
                <AnimatedItem key={article._id ?? i}>
                  <ArticleCard article={article} />
                </AnimatedItem>
              ))}
            </AnimatedGrid>
          )}
        </section>

        {/* Vendors */}
        <section>
          <h2 className="mb-5 text-xl font-bold text-neutral-900">Boutiques</h2>

          {loadingVendeurs && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-28 animate-pulse rounded-2xl bg-neutral-200" />
              ))}
            </div>
          )}

          {!loadingVendeurs && (
            <AnimatedGrid className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(vendeurs ?? []).map((v) => (
                <AnimatedItem key={v._id}>
                  <div className="flex items-center gap-4 rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-purple-100 text-lg font-bold text-purple-700">
                      {(v.shopName ?? v.nom ?? "?").charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-neutral-900">
                        {v.shopName ?? v.nom}
                      </p>
                      {v.ville && (
                        <p className="truncate text-xs text-neutral-500">{v.ville}</p>
                      )}
                      <div className="mt-1 flex items-center gap-2">
                        {v.rating != null && v.rating > 0 && (
                          <span className="flex items-center gap-0.5 text-xs text-neutral-700">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            {v.rating.toFixed(1)}
                          </span>
                        )}
                        {v.verifier && (
                          <Badge variant="outline" className="h-4 px-1.5 text-[10px]">
                            Vérifié
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </AnimatedItem>
              ))}
            </AnimatedGrid>
          )}
        </section>
      </div>
    </div>
  );
}

export default function EmarchePage() {
  return (
    <Suspense>
      <EmarcheContent />
    </Suspense>
  );
}
