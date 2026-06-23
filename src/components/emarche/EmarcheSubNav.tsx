"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ExternalLink, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProIcon } from "@/components/prestataire/ProIcon";

const NAV_ITEMS = [
  {
    href: "/emarche/espace",
    label: "Ma boutique",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/profile",
    label: "Mon profil",
    icon: User,
  },
];

export function EmarcheSubNav({
  publicShopHref,
}: {
  publicShopHref?: string;
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
                  "flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-neutral-100 text-neutral-900"
                    : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900",
                )}
              >
                <ProIcon icon={item.icon} size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        {publicShopHref && (
          <Link
            href={publicShopHref}
            className="hidden shrink-0 items-center gap-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 sm:flex"
          >
            <ExternalLink className="h-4 w-4" />
            Voir l&apos;E-marché
          </Link>
        )}
      </div>
    </div>
  );
}
