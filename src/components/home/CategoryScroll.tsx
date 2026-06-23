"use client";

import Link from "next/link";
import Image from "next/image";
import type { Categorie } from "@/types";
import { getCategoryIconConfig } from "@/lib/utils/categoryIcons";
import { getCategoryImageUrl } from "@/lib/utils/categoryImage";
import { poleToPath, type PoleType } from "@/lib/utils/filters";
import { cn } from "@/lib/utils";

export function CategoryScroll({
  pole,
  isLoading,
  categories,
}: {
  pole: PoleType;
  isLoading: boolean;
  categories?: Categorie[];
}) {
  const basePath = poleToPath(pole);

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

  return (
    <div className="flex gap-2.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {categories.slice(0, 8).map((cat) => {
        const imageUrl = getCategoryImageUrl(cat.imagecategorie);
        const { icon: Icon, color, bg } = getCategoryIconConfig(
          cat.nomcategorie,
        );

        return (
          <Link
            key={cat._id}
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
                <Image
                  src={imageUrl}
                  alt=""
                  fill
                  sizes="28px"
                  className="object-cover"
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
      })}
    </div>
  );
}
