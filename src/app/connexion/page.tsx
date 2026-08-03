"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { useAuthStore } from "@/stores";

function ConnexionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/";
  const login = useAuthStore((s) => s.login);
  const loginWithGoogle = useAuthStore((s) => s.loginWithGoogle);
  const error = useAuthStore((s) => s.error);
  const isLoading = useAuthStore((s) => s.isLoading);

  const [identifiant, setIdentifiant] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    try {
      await login({ identifiant, password });
      router.push(redirect);
    } catch {
      setLocalError("Identifiants incorrects");
    }
  };

  const handleGoogleSuccess = async (idToken: string) => {
    setLocalError("");
    try {
      await loginWithGoogle(idToken);
      router.push(redirect);
    } catch (err) {
      setLocalError(
        err instanceof Error ? err.message : "Connexion Google échouée",
      );
    }
  };

  const handleGoogleError = (err: Error) => {
    setLocalError(err.message);
  };

  return (
    <AuthLayout
      variant="connexion"
      title="Connexion"
      subtitle="Accédez à votre compte Soutrali Deals"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="identifiant" className="mb-1.5 block text-sm font-medium text-neutral-700">
            Email ou téléphone
          </label>
          <Input
            id="identifiant"
            value={identifiant}
            onChange={(e) => setIdentifiant(e.target.value)}
            placeholder="votre@email.com ou +225 07…"
            className="h-11 rounded-xl border-neutral-200 bg-neutral-50 focus:bg-white"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-neutral-700">
            Mot de passe
          </label>
          <PasswordInput
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 rounded-xl border-neutral-200 bg-neutral-50 focus:bg-white"
            required
          />
        </div>
        {(localError || error) && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600"
          >
            {localError || error}
          </motion.p>
        )}
        <Button
          type="submit"
          className="h-11 w-full rounded-xl text-base font-semibold"
          disabled={isLoading}
        >
          {isLoading ? "Connexion..." : "Se connecter"}
        </Button>
      </form>

      <div className="relative my-7">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3 text-neutral-400">ou</span>
        </div>
      </div>

      <GoogleSignInButton
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        disabled={isLoading}
      />

      <p className="mt-8 text-center text-sm text-neutral-600">
        Pas encore de compte ?{" "}
        <Link
          href="/inscription"
          className="font-semibold text-primary-600 hover:text-primary-700 hover:underline"
        >
          S&apos;inscrire gratuitement
        </Link>
      </p>
    </AuthLayout>
  );
}

export default function ConnexionPage() {
  return (
    <Suspense>
      <ConnexionForm />
    </Suspense>
  );
}
