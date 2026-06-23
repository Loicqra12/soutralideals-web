"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/hooks/useCart";
import { useAuthStore } from "@/stores";
import { NotificationBell } from "./NotificationBell";

function CartBtn() {
  const { itemCount } = useCart();
  return (
    <Link
      href="/panier"
      className="relative flex h-9 w-9 items-center justify-center rounded-full text-neutral-700"
      aria-label="Panier"
    >
      <ShoppingCart className="h-5 w-5" />
      {itemCount > 0 && (
        <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-secondary-500 text-[9px] font-bold text-white">
          {itemCount > 9 ? "9+" : itemCount}
        </span>
      )}
    </Link>
  );
}

export function MobileHeader() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-neutral-200 bg-white/95 px-4 py-2.5 backdrop-blur md:hidden">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <div className="relative h-9 w-28">
          <Image
            src="/brand/logo.png"
            alt="Soutrali Deals"
            fill
            sizes="112px"
            className="object-contain object-left"
            priority
          />
        </div>
      </Link>

      {/* Actions droite */}
      <div className="flex items-center gap-1">
        {/* Icône recherche → /recherche */}
        <button
          onClick={() => router.push("/recherche")}
          className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-700"
          aria-label="Rechercher"
        >
          <Search className="h-5 w-5" />
        </button>

        {isAuthenticated && (
          <>
            <CartBtn />
            <NotificationBell />
          </>
        )}

        {!isAuthenticated && (
          <Link
            href="/connexion"
            className="ml-1 rounded-full bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white"
          >
            Connexion
          </Link>
        )}
      </div>
    </header>
  );
}
