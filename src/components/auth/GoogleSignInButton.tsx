"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Loader2 } from "lucide-react";

// Charger GoogleLogin uniquement côté client pour éviter les erreurs d'hydration
const GoogleLogin = dynamic(
  () => import("@react-oauth/google").then((mod) => mod.GoogleLogin),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-11 w-full items-center justify-center rounded-xl border border-neutral-200 bg-white">
        <Loader2 className="h-4 w-4 animate-spin text-neutral-400" />
      </div>
    ),
  },
);

interface GoogleSignInButtonProps {
  onSuccess: (credential: string) => void | Promise<void>;
  onError?: (error: Error) => void;
  disabled?: boolean;
  text?: string;
}

/**
 * Bouton de connexion Google OAuth
 * Utilise GoogleLogin de @react-oauth/google pour obtenir un idToken
 */
export function GoogleSignInButton({
  onSuccess,
  onError,
  disabled = false,
}: GoogleSignInButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className={`w-full ${disabled || isLoading ? 'pointer-events-none opacity-50' : ''}`}>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          if (credentialResponse.credential) {
            setIsLoading(true);
            const result = onSuccess(credentialResponse.credential);

            // Gérer le cas où onSuccess retourne une Promise
            if (result instanceof Promise) {
              result
                .catch((err) => onError?.(err))
                .finally(() => setIsLoading(false));
            } else {
              setIsLoading(false);
            }
          }
        }}
        onError={() => {
          onError?.(new Error("Connexion Google annulée ou échouée"));
        }}
        useOneTap={false}
        text="continue_with"
        shape="rectangular"
        size="large"
        width="384"
      />
    </div>
  );
}
