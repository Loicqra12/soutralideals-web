"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Wrench, Laptop, ShoppingBag, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores";

const ITEMS: Array<{
  href: string;
  authHref?: string;
  label: string;
  icon: typeof Home;
}> = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/prestataires", label: "Métiers", icon: Wrench },
  { href: "/freelance", label: "Freelance", icon: Laptop },
  { href: "/emarche", label: "E-marché", icon: ShoppingBag },
  {
    href: "/profile",
    authHref: "/connexion?redirect=/profile",
    label: "Profil",
    icon: User,
  },
];

export function BottomNav() {
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-neutral-200 bg-white md:hidden">
      <div className="grid grid-cols-5">
        {ITEMS.map((item) => {
          const href =
            item.authHref && !isAuthenticated ? item.authHref : item.href;
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href) ||
                (!isAuthenticated && pathname.startsWith("/connexion"));

          return (
            <Link
              key={item.href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 py-2 text-[10px] font-medium",
                active ? "text-primary-600" : "text-neutral-500",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
