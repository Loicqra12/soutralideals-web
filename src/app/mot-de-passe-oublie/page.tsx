"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthLayout } from "@/components/auth/AuthLayout";

export default function MotDePasseOubliePage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) {
      setError("Entrez votre adresse email.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Erreur serveur");
      }
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthLayout
        variant="connexion"
        title="Email envoyé"
        subtitle="Vérifiez votre boîte mail"
      >
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>
          <p className="text-sm text-neutral-600">
            Si un compte existe pour <strong>{email}</strong>, vous recevrez un
            lien de réinitialisation valable <strong>1 heure</strong>.
          </p>
          <p className="text-xs text-neutral-400">
            Vérifiez aussi vos spams.
          </p>
          <Button className="mt-2 w-full rounded-xl" asChild>
            <Link href="/connexion">Retour à la connexion</Link>
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      variant="connexion"
      title="Mot de passe oublié"
      subtitle="Entrez votre email pour recevoir un lien de réinitialisation"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-neutral-700"
          >
            Adresse email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              className="h-11 rounded-xl border-neutral-200 bg-neutral-50 pl-9 focus:bg-white"
              required
            />
          </div>
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600"
          >
            {error}
          </motion.p>
        )}

        <Button
          type="submit"
          className="h-11 w-full rounded-xl text-base font-semibold"
          disabled={loading}
        >
          {loading ? "Envoi en cours..." : "Recevoir le lien"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-neutral-600">
        <Link
          href="/connexion"
          className="inline-flex items-center gap-1 font-medium text-primary-600 hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Retour à la connexion
        </Link>
      </p>
    </AuthLayout>
  );
}
