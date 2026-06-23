"use client";

import Link from "next/link";
import { ShoppingCart, Star } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { formatPriceFCFA } from "@/lib/utils/format";
import { resolveMediaUrl } from "@/lib/utils/mediaUrl";
import type { Article } from "@/types";
import { cardHover, imageZoom, fadeInUp } from "@/lib/animations";
import { FavoriteButton } from "@/components/shared/FavoriteButton";

export function ArticleCard({ article }: { article: Article }) {
  const imageUrl = resolveMediaUrl(article.photoArticle);
  const inStock =
    article.quantiteArticle == null || article.quantiteArticle > 0;

  return (
    <motion.div variants={fadeInUp}>
      <Link
        href={`/emarche/${article._id ?? article.nomArticle}`}
        className="block group"
      >
        <motion.article
          initial="rest"
          whileHover="hover"
          animate="rest"
          variants={cardHover}
          className="overflow-hidden rounded-2xl border border-neutral-100 bg-white"
        >
          {/* Image */}
          <div
            className={cn(
              "relative aspect-square overflow-hidden",
              inStock
                ? "bg-gradient-to-br from-neutral-50 to-neutral-100"
                : "bg-neutral-50",
            )}
          >
            {imageUrl ? (
              <motion.div variants={imageZoom} className="absolute inset-0">
                <Image
                  src={imageUrl}
                  alt={article.nomArticle}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className={cn(
                    "object-cover transition-opacity",
                    !inStock && "opacity-60",
                  )}
                />
              </motion.div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <ShoppingCart className="h-10 w-10 text-neutral-300" />
              </div>
            )}

            {!inStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-neutral-700 shadow-sm">
                  Rupture
                </span>
              </div>
            )}

            {/* Quick-add hint on hover */}
            <div className="absolute inset-x-0 bottom-0 translate-y-full bg-neutral-900/90 px-3 py-2 text-center text-xs font-medium text-white transition-transform duration-200 group-hover:translate-y-0">
              Voir le produit
            </div>
            <FavoriteButton
              objetType="ARTICLE"
              objetId={article._id ?? ""}
              titre={article.nomArticle}
              prix={article.prixArticle}
              image={article.photoArticle}
              className="absolute right-2 top-2"
              size="sm"
            />
          </div>

          {/* Info */}
          <div className="p-3">
            <h3 className="line-clamp-2 text-sm font-medium leading-snug text-neutral-900">
              {article.nomArticle}
            </h3>

            {article.rating != null && article.rating > 0 && (
              <div className="mt-1 flex items-center gap-0.5">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span className="text-[11px] text-neutral-500">
                  {article.rating.toFixed(1)}
                </span>
              </div>
            )}

            <p className="mt-2 text-base font-bold text-neutral-900">
              {formatPriceFCFA(article.prixArticle)}
            </p>
          </div>
        </motion.article>
      </Link>
    </motion.div>
  );
}
