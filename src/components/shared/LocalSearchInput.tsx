"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface LocalSearchInputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  accentColor?: string;
}

/**
 * Barre de recherche locale (filtre les résultats déjà chargés).
 * Ne redirige jamais vers /recherche — contrairement à SmartSearchBar.
 */
export function LocalSearchInput({
  value,
  onChange,
  placeholder = "Rechercher…",
  className,
  accentColor = "primary",
}: LocalSearchInputProps) {
  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "h-12 w-full rounded-xl border border-neutral-200 bg-white pl-11 pr-10 text-sm text-neutral-900 shadow-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2",
          accentColor === "blue"
            ? "focus:border-blue-500 focus:ring-blue-500/20"
            : accentColor === "purple"
              ? "focus:border-purple-500 focus:ring-purple-500/20"
              : "focus:border-primary-500 focus:ring-primary-500/20",
        )}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Effacer la recherche"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      )}
    </div>
  );
}
