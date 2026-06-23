"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchFreelancesByUtilisateur } from "@/lib/api/freelances";
import { useAuthStore } from "@/stores";

/**
 * Redirige vers l'espace freelance si l'utilisateur a déjà un profil.
 */
export function useFreelanceGuard(redirectTo = "/freelance/espace") {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const utilisateur = useAuthStore((s) => s.utilisateur);
  const refreshRoles = useAuthStore((s) => s.refreshRoles);

  const [ready, setReady] = useState(false);
  const [alreadyFreelance, setAlreadyFreelance] = useState(false);

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
        if (roles.includes("FREELANCE") || details.freelance) {
          setAlreadyFreelance(true);
          router.replace(redirectTo);
          return;
        }

        const profiles = await fetchFreelancesByUtilisateur(utilisateur._id);
        if (cancelled) return;

        if (profiles.length > 0) {
          await refreshRoles();
          setAlreadyFreelance(true);
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
    ready: ready && !alreadyFreelance,
    isAuthenticated,
    isLoading: isLoading || (!ready && isAuthenticated),
    alreadyFreelance,
  };
}
