"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchVendeursByUtilisateur } from "@/lib/api/vendeurs";
import { useAuthStore } from "@/stores";

/**
 * Redirige vers l'E-marché si l'utilisateur a déjà une boutique.
 */
export function useVendeurGuard(redirectTo = "/emarche/espace") {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const utilisateur = useAuthStore((s) => s.utilisateur);
  const refreshRoles = useAuthStore((s) => s.refreshRoles);

  const [ready, setReady] = useState(false);
  const [alreadyVendeur, setAlreadyVendeur] = useState(false);

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
        if (roles.includes("VENDEUR") || details.vendeur) {
          setAlreadyVendeur(true);
          router.replace(redirectTo);
          return;
        }

        const profiles = await fetchVendeursByUtilisateur(utilisateur._id);
        if (cancelled) return;

        if (profiles.length > 0) {
          await refreshRoles();
          setAlreadyVendeur(true);
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
    ready: ready && !alreadyVendeur,
    isAuthenticated,
    isLoading: isLoading || (!ready && isAuthenticated),
    alreadyVendeur,
  };
}
