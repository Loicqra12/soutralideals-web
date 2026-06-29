"use client";

import { usePathname } from "next/navigation";
import { PrestataireSubNav } from "@/components/prestataire/PrestataireSubNav";
import { useMyPrestataire } from "@/lib/hooks/useMyPrestataire";

const ONBOARDING_PREFIXES = [
  "/prestataire/inscription",
  "/prestataire/registration",
  "/prestataire/finalisation",
];

export default function PrestataireLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isOnboarding = ONBOARDING_PREFIXES.some((p) => pathname.startsWith(p));
  const { data: profile } = useMyPrestataire();
  const publicHref = profile?._id ? `/prestataires/${profile._id}` : undefined;

  if (isOnboarding) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-full bg-neutral-50">
      <PrestataireSubNav publicProfileHref={publicHref} />
      {children}
    </div>
  );
}
