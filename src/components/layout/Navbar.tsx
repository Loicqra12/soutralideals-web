"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  Heart,
  Package,
  Wrench,
  Laptop,
  ShoppingBag,
  LayoutDashboard,
  User,
  Settings,
  LogOut,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores";
import { getRoleDashboard, getRoleLabel, PRO_ROLES } from "@/lib/auth/roleLabels";
import { MegaNav } from "./MegaMenu";
import { useCart } from "@/lib/hooks/useCart";
import { NotificationBell } from "./NotificationBell";

const PROPOSER_OPTIONS = [
  {
    href: "/prestataire/inscription",
    label: "Devenir prestataire",
    dashboardHref: "/prestataire/dashboard",
    dashboardLabel: "Mon espace prestataire",
    desc: "Services : coiffure, plomberie…",
    icon: Wrench,
    match: "/prestataires",
    role: "PRESTATAIRE" as const,
  },
  {
    href: "/freelance/inscription",
    label: "Devenir freelance",
    dashboardHref: "/freelance/espace",
    dashboardLabel: "Mon espace freelance",
    desc: "Dev, design, marketing…",
    icon: Laptop,
    match: "/freelance",
    role: "FREELANCE" as const,
  },
  {
    href: "/emarche/inscription",
    label: "Ouvrir une boutique",
    dashboardHref: "/emarche/espace",
    dashboardLabel: "Ma boutique",
    desc: "Vendez vos produits en ligne",
    icon: ShoppingBag,
    match: "/emarche",
    role: "VENDEUR" as const,
  },
];

// Retourne le CTA contextuel selon la page active
function useContextualCTA(pathname: string) {
  const match = PROPOSER_OPTIONS.find((opt) => pathname.startsWith(opt.match));
  return match ?? null;
}

function getInitials(prenom?: string, nom?: string): string {
  const p = prenom?.charAt(0).toUpperCase() ?? "";
  const n = nom?.charAt(0).toUpperCase() ?? "";
  return p + n || "?";
}

// Composant : bouton "Proposer mes services" (dropdown générique)
function ProposerDropdown() {
  const hasRole = useAuthStore((s) => s.hasRole);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" className="gap-1.5 rounded-full">
          <Plus className="h-3.5 w-3.5" />
          Proposer mes services
          <ChevronDown className="h-3.5 w-3.5 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Choisissez votre activité</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {PROPOSER_OPTIONS.map((opt) => {
          const isPro = hasRole(opt.role);
          const href = isPro ? opt.dashboardHref : opt.href;
          const label = isPro ? opt.dashboardLabel : opt.label;
          return (
            <DropdownMenuItem key={opt.href} asChild>
              <Link href={href} className="flex items-start gap-3 py-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                  <opt.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-neutral-900">{label}</p>
                  <p className="text-xs text-neutral-500">{opt.desc}</p>
                </div>
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Composant : bouton CTA contextuel (page spécifique)
function ContextualCTAButton({ opt }: { opt: (typeof PROPOSER_OPTIONS)[0] }) {
  const hasRole = useAuthStore((s) => s.hasRole);
  const isPro = hasRole(opt.role);
  const href = isPro ? opt.dashboardHref : opt.href;
  const label = isPro ? opt.dashboardLabel : opt.label;

  return (
    <Button size="sm" asChild className="gap-1.5 rounded-full">
      <Link href={href}>
        <opt.icon className="h-3.5 w-3.5" />
        {label}
      </Link>
    </Button>
  );
}

// Composant : menu profil utilisateur connecté
function UserMenu() {
  const router = useRouter();
  const { utilisateur, roles, activeRole, logout, hasRole, switchRole } =
    useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const initials = getInitials(utilisateur?.prenom, utilisateur?.nom);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full ring-2 ring-transparent transition-all hover:ring-primary-200 focus:outline-none focus:ring-primary-300">
          <Avatar className="h-8 w-8 cursor-pointer">
            <AvatarImage src={utilisateur?.photoProfil} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="normal-case">
          <p className="text-sm font-semibold text-neutral-900">
            {utilisateur?.prenom} {utilisateur?.nom}
          </p>
          <p className="text-xs font-normal text-neutral-500">
            {utilisateur?.email ?? utilisateur?.telephone}
          </p>
        </DropdownMenuLabel>

        {/* Bascule mode pro / client (style Fiverr) */}
        {roles.some((r) => PRO_ROLES.includes(r as (typeof PRO_ROLES)[number])) && (
          <>
            <DropdownMenuSeparator />
            <div className="px-2 py-1">
              {PRO_ROLES.filter((r) => roles.includes(r)).map((role) => {
                const dash = getRoleDashboard(role);
                if (!dash) return null;
                const isActive = activeRole === role;
                return (
                  <DropdownMenuItem key={role} asChild>
                    <Link
                      href={dash.href}
                      onClick={() => switchRole(role)}
                      className={cn(
                        "mb-1 flex w-full items-center justify-center rounded-lg border py-2 font-medium",
                        isActive
                          ? "border-primary-500 bg-primary-50 text-primary-700"
                          : "border-neutral-200 text-neutral-700 hover:bg-neutral-50",
                      )}
                    >
                      {dash.label}
                    </Link>
                  </DropdownMenuItem>
                );
              })}
              {activeRole !== "CLIENT" && (
                <DropdownMenuItem asChild>
                  <Link
                    href="/"
                    onClick={() => switchRole("CLIENT")}
                    className="flex w-full items-center justify-center rounded-lg border border-neutral-200 py-2 text-sm text-neutral-600 hover:bg-neutral-50"
                  >
                    Mode client
                  </Link>
                </DropdownMenuItem>
              )}
            </div>
          </>
        )}

        {roles.length > 1 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-neutral-500">
              Rôles du compte
            </DropdownMenuLabel>
            {roles.map((role) => (
              <DropdownMenuItem
                key={role}
                onClick={() => switchRole(role)}
                className={cn(
                  role === activeRole && "bg-primary-50 text-primary-700",
                )}
              >
                <span className="flex-1">{getRoleLabel(role)}</span>
                {role === activeRole && (
                  <span className="h-2 w-2 rounded-full bg-primary-500" />
                )}
              </DropdownMenuItem>
            ))}
          </>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {hasRole("PRESTATAIRE") && (
            <DropdownMenuItem asChild>
              <Link href="/prestataire/dashboard">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard prestataire
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem asChild>
            <Link href="/profile">
              <User className="h-4 w-4" />
              Mon profil
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/favoris">
              <Heart className="h-4 w-4" />
              Mes favoris
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/commandes">
              <Package className="h-4 w-4" />
              Mes commandes
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings">
              <Settings className="h-4 w-4" />
              Paramètres
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-red-600 focus:text-red-600"
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function CartButton() {
  const { itemCount } = useCart();
  return (
    <Link
      href="/panier"
      className="relative rounded-full p-2 text-neutral-600 transition-colors hover:bg-neutral-100"
      aria-label="Panier"
    >
      <ShoppingBag className="h-5 w-5" />
      {itemCount > 0 && (
        <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-secondary-500 text-[10px] font-bold text-white">
          {itemCount > 9 ? "9+" : itemCount}
        </span>
      )}
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();
  const contextualCTA = useContextualCTA(pathname);

  return (
    <header className="relative sticky top-0 z-40 hidden border-b border-neutral-200 bg-white/95 backdrop-blur md:block">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">

        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <div className="relative h-[52px] w-[160px]">
            <Image
              src="/brand/logo.png"
              alt="Soutrali Deals"
              fill
              sizes="160px"
              className="object-contain object-left"
              priority
            />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-neutral-900">
            SOUTRALI DEALS
          </span>
        </Link>

        {/* Nav avec mega-menu */}
        <nav>
          <MegaNav pathname={pathname} />
        </nav>

        {/* Actions droite */}
        <div className="flex items-center gap-2">
          {/* CTA contextuel ou générique */}
          {contextualCTA ? (
            <ContextualCTAButton opt={contextualCTA} />
          ) : (
            <ProposerDropdown />
          )}

          {isAuthenticated ? (
            <>
              <CartButton />
              <NotificationBell />
              <UserMenu />
            </>
          ) : (
            <Link
              href="/connexion"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100"
            >
              <User className="h-5 w-5" />
              Connexion
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
