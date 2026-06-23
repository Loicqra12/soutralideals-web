import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { AuthResponse, LoginPayload } from "@/types";
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
    const body = (await request.json()) as LoginPayload;
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const error = await res.text();
      return NextResponse.json(
        { message: error || "Identifiants invalides" },
        { status: res.status },
      );
    }

    const auth = (await res.json()) as AuthResponse;
    // Sécurité : supprimer le hash du mot de passe renvoyé par le backend
    if (auth.utilisateur) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (auth.utilisateur as any).password;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (auth.utilisateur as any).tokens;
    }
    const { roles: rolesData, details } = await fetchRoles(
      auth.utilisateur._id,
      auth.token,
    );
    const roles = rolesData;
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
