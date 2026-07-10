import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { fetchUserRolesFromApi } from "@/lib/auth/roles";
import { COOKIE_NAMES } from "@/lib/auth/cookie-utils";

const protectedRoutes = ["/profile", "/settings", "/panier", "/commandes", "/favoris", "/messages", "/notifications"];
const proEspaceRoutes = ["/freelance/espace", "/emarche/espace"];
const prestataireAuthRoutes = [
  "/prestataire/registration",
  "/prestataire/finalisation",
  "/prestataire/dashboard",
  "/prestataire/missions",
];

const prestataireProRoutes = [
  "/prestataire/dashboard",
  "/prestataire/missions",
  "/prestataire/finalisation",
  "/prestataire/profil",
];
const freelanceAuthRoutes = ["/freelance/inscription/formulaire"];
const emarcheAuthRoutes = ["/emarche/inscription/formulaire"];

function parseRoles(raw?: string): string[] {
  if (!raw) return [];
  try {
    return (JSON.parse(raw) as string[]).map((r) => r.toUpperCase());
  } catch {
    return [];
  }
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAMES.token)?.value;
  const rolesRaw = request.cookies.get(COOKIE_NAMES.roles)?.value;
  const userRaw = request.cookies.get(COOKIE_NAMES.user)?.value;
  const { pathname } = request.nextUrl;

  const needsAuth =
    protectedRoutes.some((route) => pathname.startsWith(route)) ||
    proEspaceRoutes.some((route) => pathname.startsWith(route)) ||
    prestataireAuthRoutes.some((route) => pathname.startsWith(route)) ||
    freelanceAuthRoutes.some((route) => pathname.startsWith(route)) ||
    emarcheAuthRoutes.some((route) => pathname.startsWith(route));

  if (needsAuth && !token) {
    const url = new URL("/connexion", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (prestataireProRoutes.some((route) => pathname.startsWith(route))) {
    let roles = parseRoles(rolesRaw);

    if (!roles.includes("PRESTATAIRE") && token && userRaw) {
      try {
        const user = JSON.parse(userRaw) as { _id: string };
        const fresh = await fetchUserRolesFromApi(user._id, token);
        roles = fresh.roles;
        if (roles.includes("PRESTATAIRE")) {
          const response = NextResponse.next();
          response.cookies.set(COOKIE_NAMES.roles, JSON.stringify(roles), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
          });
          return response;
        }
      } catch (err) {
        // En développement, tracer l'erreur pour faciliter le debug
        if (process.env.NODE_ENV !== "production") {
          console.error("[middleware] Erreur fetch rôles prestataire:", err);
        }
        // En production : continuer sans bloquer — le check roles.includes ci-dessous
        // redirigera vers /prestataire/registration si le rôle est absent
      }
    }

    if (!roles.includes("PRESTATAIRE")) {
      return NextResponse.redirect(
        new URL("/prestataire/registration", request.url),
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/settings/:path*",
    "/panier/:path*",
    "/commandes/:path*",
    "/favoris/:path*",
    "/notifications/:path*",
    "/messages/:path*",
    "/freelance/espace/:path*",
    "/emarche/espace/:path*",
    "/prestataire/:path*",
    "/freelance/profil/:path*",
    "/freelance/inscription/formulaire",
    "/emarche/inscription/formulaire",
  ],
};

