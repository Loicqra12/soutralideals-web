"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores";
import {
  ChangePasswordForm,
  SettingsLinks,
} from "@/components/settings/ChangePasswordForm";

export default function SettingsPage() {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const isLoading = useAuthStore((s) => s.isLoading);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="h-48 animate-pulse rounded-xl bg-neutral-100" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-8 lg:px-8">
      <SettingsLinks />

      <ChangePasswordForm />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Session</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-neutral-600">
            Déconnectez-vous de votre compte sur cet appareil.
          </p>
          <Button
            variant="outline"
            className="text-red-600 hover:text-red-700"
            onClick={handleLogout}
          >
            Se déconnecter
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
