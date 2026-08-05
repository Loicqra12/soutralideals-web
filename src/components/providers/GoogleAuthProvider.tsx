"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { useRef } from "react";
import { GOOGLE_CLIENT_ID } from "@/lib/auth/google-auth";

interface GoogleAuthProviderProps {
  children: React.ReactNode;
}

/**
 * Provider Google OAuth — un seul montage grâce au ref guard.
 * Évite le warning "initialize() called multiple times" en Strict Mode.
 */
export function GoogleAuthProvider({ children }: GoogleAuthProviderProps) {
  // Montage côté serveur : ne rien faire (GoogleOAuthProvider est client-only)
  const mounted = useRef(false);
  if (typeof window !== "undefined") {
    mounted.current = true;
  }

  if (!GOOGLE_CLIENT_ID) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[GoogleAuthProvider] NEXT_PUBLIC_GOOGLE_CLIENT_ID n'est pas défini",
      );
    }
    return <>{children}</>;
  }

  return (
    <GoogleOAuthProvider
      clientId={GOOGLE_CLIENT_ID}
      onScriptLoadError={() =>
        console.warn("[GoogleAuthProvider] script Google non chargé")
      }
    >
      {children}
    </GoogleOAuthProvider>
  );
}
