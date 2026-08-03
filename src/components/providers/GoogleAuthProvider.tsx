"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { GOOGLE_CLIENT_ID } from "@/lib/auth/google-auth";

interface GoogleAuthProviderProps {
  children: React.ReactNode;
}

/**
 * Provider Google OAuth - Wrapper pour l'application
 * Fournit le contexte Google Sign-In à tous les composants enfants
 */
export function GoogleAuthProvider({ children }: GoogleAuthProviderProps) {
  if (!GOOGLE_CLIENT_ID) {
    console.warn(
      "[GoogleAuthProvider] NEXT_PUBLIC_GOOGLE_CLIENT_ID n'est pas défini",
    );
    // Retourne les enfants sans le provider si la clé n'est pas configurée
    return <>{children}</>;
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {children}
    </GoogleOAuthProvider>
  );
}
