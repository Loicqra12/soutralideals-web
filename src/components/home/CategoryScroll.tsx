"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Categorie } from "@/types";
import { getCategoryIconConfig } from "@/lib/utils/categoryIcons";
import { getCategoryImageUrl } from "@/lib/utils/categoryImage";
import { EntityImage } from "@/components/shared/EntityImage";
import { poleToPath, type PoleType } from "@/lib/utils/filters";
import { cn } from "@/lib/utils";

const DEFAULT_LIMIT = 8;

function CategoryItem({
  cat,
  basePath,
}: {
  cat: Categorie;
  basePath: string;
}) {
  const imageUrl = getCategoryImageUrl(cat.imagecategorie);
  const { icon: Icon, color, bg } = getCategoryIconConfig(cat.nomcategorie);

  return (
    <Link
      href={`${basePath}?categorie=${encodeURIComponent(cat.nomcategorie)}`}
      className="group flex shrink-0 items-center gap-2 rounded-full border border-neutral-200 bg-white px-3.5 py-2 text-sm font-medium text-neutral-700 transition-colors hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700"
    >
      <span
        className={cn(
          "relative h-7 w-7 shrink-0 overflow-hidden rounded-full",
          !imageUrl && bg,
        )}
      >
        {imageUrl ? (
          <EntityImage
            src={imageUrl}
            alt=""
            className="absolute inset-0 rounded-full"
            sizes="28px"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center">
            <Icon className={cn("h-3.5 w-3.5", color)} />
          </span>
        )}
      </span>
      {cat.nomcategorie}
    </Link>
  );
}

export function CategoryScroll({
  pole,
  isLoading,
  categories,
  initialLimit = DEFAULT_LIMIT,
}: {
  pole: PoleType;
  isLoading: boolean;
  categories?: Categorie[];
  initialLimit?: number;
}) {
  const basePath = poleToPath(pole);
  const [expanded, setExpanded] = useState(false);

  if (isLoading) {
    return (
      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-10 w-28 shrink-0 animate-pulse rounded-full bg-neutral-100"
          />
        ))}
      </div>
    );
  }

  if (!categories?.length) {
    return (
      <p className="text-sm text-neutral-400">
        Aucune catégorie disponible pour le moment.
      </p>
    );
  }

  const hasMore = categories.length > initialLimit;
  const visible = expanded ? categories : categories.slice(0, initialLimit);
  const hiddenCount = categories.length - initialLimit;

  return (
    <div>
      <AnimatePresence mode="wait">
        {expanded ? (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="flex flex-wrap gap-2.5"
          >
            {visible.map((cat) => (
              <CategoryItem key={cat._id} cat={cat} basePath={basePath} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {visible.map((cat) => (
              <CategoryItem key={cat._id} cat={cat} basePath={basePath} />
            ))}
            {hasMore && (
              <button
                type="button"
                onClick={() => setExpanded(true)}
                aria-label={`Voir ${hiddenCount} catégories supplémentaires`}
                className="group flex shrink-0 items-center gap-2 rounded-full border-2 border-dashed border-neutral-200 bg-neutral-50 px-3.5 py-2 text-sm font-medium text-neutral-600 transition-colors hover:border-primary-400 hover:bg-primary-50 hover:text-primary-700"
              >
                <ChevronDown className="h-4 w-4 text-neutral-400 group-hover:text-primary-600" />
                Voir plus
                <span className="rounded-full bg-neutral-200/80 px-1.5 py-0.5 text-[10px] font-semibold text-neutral-500 group-hover:bg-primary-100 group-hover:text-primary-700">
                  +{hiddenCount}
                </span>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!expanded && hasMore && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-200 bg-neutral-50 py-2 text-sm font-medium text-neutral-600 transition-colors hover:border-primary-400 hover:bg-primary-50 hover:text-primary-700 sm:w-auto sm:px-5"
        >
          <ChevronDown className="h-4 w-4" />
          Voir toutes les catégories
          <span className="rounded-full bg-neutral-200/80 px-2 py-0.5 text-xs font-semibold text-neutral-500">
            +{hiddenCount}
          </span>
        </button>
      )}

      {expanded && hasMore && (
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="mt-3 flex items-center gap-1.5 text-sm font-medium text-primary-600 transition-colors hover:text-primary-700"
        >
          <ChevronUp className="h-4 w-4" />
          Voir moins
        </button>
      )}
    </div>
  );
}
