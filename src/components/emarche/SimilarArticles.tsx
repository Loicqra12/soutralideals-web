"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { fetchArticles } from "@/lib/api/articles";
import { ArticleCard } from "@/components/emarche/ArticleCard";
import type { Article } from "@/types";

interface SimilarArticlesProps {
  currentId?: string;
  categorie?: string | { _id?: string; nomcategorie?: string } | null;
}

function getCategorieId(cat: SimilarArticlesProps["categorie"]): string | null {
  if (!cat) return null;
  if (typeof cat === "string") return cat;
  return cat._id ?? cat.nomcategorie ?? null;
}

function getCategorieLabel(cat: SimilarArticlesProps["categorie"]): string | null {
  if (!cat) return null;
  if (typeof cat === "string") return null;
  return cat.nomcategorie ?? null;
}

export function SimilarArticles({ currentId, categorie }: SimilarArticlesProps) {
  const { data: articles } = useQuery({
    queryKey: ["articles-similar", currentId],
    queryFn: () => fetchArticles(),
    staleTime: 5 * 60 * 1000,
  });

  const catId = getCategorieId(categorie);
  const catLabel = getCategorieLabel(categorie);

  const similar: Article[] = (articles ?? [])
    .filter((a) => {
      if (a._id === currentId) return false;
      const aCatId = typeof a.categorie === "object" ? a.categorie?._id : a.categorie;
      const aCatLabel = typeof a.categorie === "object" ? (a.categorie as { nomcategorie?: string })?.nomcategorie : null;
      if (catId && aCatId === catId) return true;
      if (catLabel && aCatLabel === catLabel) return true;
      return false;
    })
    .slice(0, 4);

  if (similar.length === 0) return null;

  return (
    <section className="border-t border-neutral-100 pt-10">
      <h2 className="mb-5 text-lg font-semibold text-neutral-900">
        Produits similaires
      </h2>
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
        {similar.map((article, i) => (
          <motion.div
            key={article._id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.35 }}
          >
            <ArticleCard article={article} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
