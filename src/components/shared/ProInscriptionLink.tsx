"use client";

import Link from "next/link";
import type { ProRole } from "@/lib/utils/proCta";
import {
  PRO_INSCRIPTION_OPTIONS,
  resolveProHref,
} from "@/lib/utils/proCta";
import { useAuthStore } from "@/stores";

interface ProInscriptionLinkProps {
  role: ProRole;
  className?: string;
  children?: React.ReactNode;
}

export function ProInscriptionLink({
  role,
  className,
  children,
}: ProInscriptionLinkProps) {
  const hasRole = useAuthStore((s) => s.hasRole);
  const option = PRO_INSCRIPTION_OPTIONS.find((o) => o.role === role)!;
  const { href, label } = resolveProHref(option, hasRole);

  return (
    <Link href={href} className={className}>
      {children ?? label}
    </Link>
  );
}
