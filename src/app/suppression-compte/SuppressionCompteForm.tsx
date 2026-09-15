"use client";

import { FormEvent, useState } from "react";

type Status = "idle" | "loading" | "done" | "error";

export function SuppressionCompteForm() {
  const [email, setEmail] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage(null);
    try {
      const res = await fetch("/api/backend/utilisateur/public-deletion-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          confirmation: confirmation.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setMessage(
          typeof data?.error === "string"
            ? data.error
            : "Demande impossible pour le moment. Réessayez plus tard.",
        );
        return;
      }
      setStatus("done");
      setMessage(
        typeof data?.message === "string"
          ? data.message
          : "Si un compte correspond à cette adresse, une demande de suppression a été enregistrée.",
      );
    } catch {
      setStatus("error");
      setMessage(
        "Réseau indisponible. Vérifiez votre connexion et réessayez.",
      );
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm"
    >
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Adresse e-mail du compte
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-emerald-600"
          placeholder="vous@exemple.com"
        />
      </div>
      <div>
        <label htmlFor="confirmation" className="block text-sm font-medium">
          Tapez SUPPRIMER pour confirmer
        </label>
        <input
          id="confirmation"
          type="text"
          required
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
          className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-emerald-600"
          placeholder="SUPPRIMER"
        />
      </div>
      <p className="text-xs text-neutral-500">
        Pour des raisons de confidentialité, la réponse ne confirme jamais si
        un compte existe.
      </p>
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-md bg-red-700 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {status === "loading" ? "Envoi…" : "Envoyer la demande de suppression"}
      </button>
      {message ? (
        <p
          className={
            status === "error"
              ? "text-sm text-red-700"
              : "text-sm text-emerald-800"
          }
          role="status"
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
