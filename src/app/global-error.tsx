"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="fr">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
          <p className="text-[6rem] font-black leading-none text-neutral-100 select-none">
            :(
          </p>
          <h1 className="mt-2 text-2xl font-bold text-neutral-900">
            Une erreur s&apos;est produite
          </h1>
          <p className="mt-3 max-w-sm text-neutral-500">
            Quelque chose s&apos;est mal passé. Vous pouvez essayer de recharger
            la page.
          </p>
          <div className="mt-8 flex gap-3">
            <Button onClick={reset}>Réessayer</Button>
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/")}
            >
              Retour à l&apos;accueil
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
