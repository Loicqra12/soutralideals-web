"use client";

import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsFavorite, useToggleFavorite } from "@/lib/hooks/useFavorites";
import type { FavoriteType } from "@/lib/api/favorites";
import { useAuthStore } from "@/stores";

interface FavoriteButtonProps {
  objetType: FavoriteType;
  objetId: string;
  titre: string;
  image?: string;
  prix?: number;
  className?: string;
  size?: "sm" | "md";
}

export function FavoriteButton({
  objetType,
  objetId,
  titre,
  image,
  prix,
  className,
  size = "md",
}: FavoriteButtonProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isFavorite = useIsFavorite(objetType, objetId);
  const { mutate, isPending } = useToggleFavorite();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return;
    mutate({ objetType, objetId, titre, image, prix });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
      disabled={isPending}
      className={cn(
        "flex items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm transition-transform hover:scale-110 active:scale-95 disabled:opacity-50",
        size === "sm" ? "h-7 w-7" : "h-9 w-9",
        className,
      )}
    >
      <Heart
        className={cn(
          size === "sm" ? "h-3.5 w-3.5" : "h-4.5 w-4.5",
          isFavorite
            ? "fill-red-500 text-red-500"
            : "text-neutral-500",
          "transition-colors",
        )}
      />
    </button>
  );
}
