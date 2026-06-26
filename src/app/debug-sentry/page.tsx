"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function DebugSentryPage() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const host = window.location.hostname;
    setAllowed(
      host === "localhost" ||
        host === "127.0.0.1" ||
        process.env.NEXT_PUBLIC_ENABLE_SENTRY_DEBUG === "true",
    );
  }, []);

  if (!allowed) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="text-xl font-bold">404</h1>
        <p className="mt-2 text-neutral-500">Page introuvable.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-20">
      <h1 className="text-2xl font-bold">Test Sentry — sdeals-front</h1>
      <p className="mt-2 text-neutral-600">
        Utilisez ces boutons pour envoyer une erreur test vers Sentry (mode
        production uniquement).
      </p>

      <div className="mt-8 flex flex-col gap-3">
        <Button
          onClick={() => {
            throw new Error("My first Sentry error! (sdeals-front client test)");
          }}
        >
          Erreur client (throw)
        </Button>

        <Button
          variant="outline"
          onClick={() => {
            Sentry.captureException(
              new Error("My first Sentry error! (sdeals-front captureException)"),
            );
            alert("captureException envoyé — vérifiez Sentry Issues dans ~30 s");
          }}
        >
          Erreur client (captureException)
        </Button>

        <Button
          variant="secondary"
          onClick={() => {
            window.location.href = "/api/debug-sentry";
          }}
        >
          Erreur serveur (API route)
        </Button>
      </div>

      <p className="mt-8 text-sm text-neutral-500">
        Puis ouvrez Sentry → Issues. Cette page n&apos;est accessible qu&apos;en
        local.
      </p>
    </div>
  );
}
