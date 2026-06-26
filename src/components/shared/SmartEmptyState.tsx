"use client";

import { useEffect, useState } from "react";
import { AlertCircle, RefreshCw, ServerOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SmartEmptyStateProps {
  isLoading: boolean;
  hasData: boolean;
  error?: unknown;
  timeoutMs?: number;
  emptyTitle?: string;
  emptyText?: string;
  errorText?: string;
  onRetry?: () => void;
}

/**
 * Gère intelligemment 3 cas :
 * 1. Chargement trop long → affiche un message d'attente au lieu du skeleton infini
 * 2. Données vides → message friendly
 * 3. Erreur → message + bouton retry
 */
export function SmartEmptyState({
  isLoading,
  hasData,
  error,
  timeoutMs = 12000,
  emptyTitle = "Aucun résultat",
  emptyText = "Aucune donnée disponible pour le moment.",
  errorText = "Impossible de charger les données. Vérifiez que le serveur est démarré.",
  onRetry,
}: SmartEmptyStateProps) {
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setTimedOut(false);
      return;
    }
    const timer = setTimeout(() => setTimedOut(true), timeoutMs);
    return () => clearTimeout(timer);
  }, [isLoading, timeoutMs]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-red-200 bg-red-50 py-16 text-center">
        <ServerOff className="h-12 w-12 text-red-300" />
        <p className="mt-4 font-semibold text-neutral-900">Serveur inaccessible</p>
        <p className="mt-2 max-w-sm text-sm text-neutral-500">{errorText}</p>
        {onRetry && (
          <Button variant="outline" size="sm" className="mt-5" onClick={onRetry}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Réessayer
          </Button>
        )}
      </div>
    );
  }

  if (isLoading && timedOut) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-amber-200 bg-amber-50 py-16 text-center">
        <AlertCircle className="h-12 w-12 text-amber-400" />
        <p className="mt-4 font-semibold text-neutral-900">Chargement lent…</p>
        <p className="mt-2 max-w-sm text-sm text-neutral-500">
          Le serveur met du temps à répondre. Vérifiez votre connexion ou réessayez.
        </p>
        {onRetry && (
          <Button variant="outline" size="sm" className="mt-5" onClick={onRetry}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Réessayer
          </Button>
        )}
      </div>
    );
  }

  if (!isLoading && !hasData) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-white py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
          <svg
            viewBox="0 0 24 24"
            className="h-8 w-8"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
            />
          </svg>
        </div>
        <p className="mt-4 text-lg font-semibold text-neutral-900">{emptyTitle}</p>
        <p className="mt-2 max-w-sm text-sm text-neutral-500">{emptyText}</p>
      </div>
    );
  }

  return null;
}
