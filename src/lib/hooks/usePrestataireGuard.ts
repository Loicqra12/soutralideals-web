"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchPrestataires } from "@/lib/api/prestataires";
import { useAuthStore } from "@/stores";

/**
 * Redirige vers le dashboard si l'utilisateur a déjà un profil prestataire
 * (compte créé sur mobile ou web).
 */
export function usePrestataireGuard(redirectTo = "/prestataire/dashboard") {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const utilisateur = useAuthStore((s) => s.utilisateur);
  const refreshRoles = useAuthStore((s) => s.refreshRoles);

  const [ready, setReady] = useState(false);
  const [alreadyPrestataire, setAlreadyPrestataire] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      if (isLoading) return;

      if (!isAuthenticated || !utilisateur?._id) {
        if (!cancelled) setReady(true);
        return;
      }

      try {
        await refreshRoles();
        if (cancelled) return;

        const roles = useAuthStore.getState().roles;
        const details = useAuthStore.getState().roleDetails;
        if (roles.includes("PRESTATAIRE") || details.prestataire) {
          setAlreadyPrestataire(true);
          router.replace(redirectTo);
          return;
        }

        const profiles = await fetchPrestataires({
          utilisateur: utilisateur._id,
        });
        if (cancelled) return;

        if (profiles.length > 0) {
          await refreshRoles();
          setAlreadyPrestataire(true);
          router.replace(redirectTo);
          return;
        }
      } catch {
        // Laisse l'utilisateur continuer l'inscription
      }

      if (!cancelled) setReady(true);
    }

    check();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isLoading, utilisateur?._id, refreshRoles, router, redirectTo]);

  return {
    ready: ready && !alreadyPrestataire,
    isAuthenticated,
    isLoading: isLoading || (!ready && isAuthenticated),
    alreadyPrestataire,
  };
}
