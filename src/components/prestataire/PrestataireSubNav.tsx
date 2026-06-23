"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  ExternalLink,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ProIcon } from "./ProIcon";

const NAV_ITEMS = [
  {
    href: "/prestataire/dashboard",
    label: "Tableau de bord",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/prestataire/missions",
    label: "Missions",
    icon: Briefcase,
  },
  {
    href: "/profile",
    label: "Mon profil",
    icon: User,
  },
];

export function PrestataireSubNav({
  publicProfileHref,
}: {
  publicProfileHref?: string;
}) {
  const pathname = usePathname();

  return (
    <div className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 lg:px-8">
        <nav className="flex gap-1 overflow-x-auto py-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {NAV_ITEMS.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                  active
                    ? "border-neutral-900 text-neutral-900"
                    : "border-transparent text-neutral-500 hover:text-neutral-900",
                )}
              >
                <ProIcon icon={item.icon} size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {publicProfileHref && (
          <Link
            href={publicProfileHref}
            className="hidden shrink-0 items-center gap-1.5 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-50 sm:flex"
          >
            <ProIcon icon={ExternalLink} size={14} />
            Profil public
          </Link>
        )}
      </div>
    </div>
  );
}
