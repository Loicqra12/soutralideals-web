import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { AuthResponse, RegisterPayload } from "@/types";
import { fetchUserRolesFromApi } from "@/lib/auth/roles";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";
const COOKIE_NAME = "auth_token";
const USER_COOKIE = "user_data";
const ROLES_COOKIE = "user_roles";

function setAuthCookies(response: NextResponse, auth: AuthResponse, roles: string[]) {
  response.cookies.set(COOKIE_NAME, auth.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  response.cookies.set(USER_COOKIE, JSON.stringify(auth.utilisateur), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  response.cookies.set(ROLES_COOKIE, JSON.stringify(roles), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

async function fetchRoles(userId: string, token: string) {
  return fetchUserRolesFromApi(userId, token);
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RegisterPayload;
    // Backend exige PascalCase : "Client", "Prestataire", "Vendeur", "Freelance"
    const rolePascal = (body.role ?? "Client").charAt(0).toUpperCase() +
      (body.role ?? "Client").slice(1).toLowerCase();

    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, role: rolePascal }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const details =
        typeof err === "object" && err && "details" in err && Array.isArray(err.details)
          ? (err.details as Array<{ message?: string }>)
          : [];
      const detailMessage = details.find((d) => d.message)?.message;
      const message =
        detailMessage ??
        (typeof err === "object" && err && "error" in err
          ? String((err as { error: string }).error)
          : typeof err === "object" && err && "message" in err
            ? String((err as { message: string }).message)
            : "Inscription impossible");
      return NextResponse.json({ message, details }, { status: res.status });
    }

    const auth = (await res.json()) as AuthResponse;
    const { roles, details } = await fetchRoles(auth.utilisateur._id, auth.token);
    const response = NextResponse.json({
      utilisateur: auth.utilisateur,
      roles,
      activeRole: roles[0] ?? "CLIENT",
      roleDetails: details,
    });
    setAuthCookies(response, auth, roles);
    return response;
  } catch {
    return NextResponse.json(
      { message: "Erreur de connexion au serveur" },
      { status: 500 },
    );
  }
}
