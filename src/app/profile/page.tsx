"use client";

import { useAuthStore } from "@/stores";
import { ProfileForm } from "@/components/profile/ProfileForm";

export default function ProfilePage() {
  const { utilisateur, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="h-64 animate-pulse rounded-xl bg-neutral-100" />
      </div>
    );
  }

  if (!utilisateur) {
    return null;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 lg:px-8">
      <ProfileForm />
    </div>
  );
}
