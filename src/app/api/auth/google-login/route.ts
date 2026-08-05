import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { fetchUserRolesFromApi } from "@/lib/auth/roles";
import {
  COOKIE_NAMES,
  COOKIE_OPTIONS,
  REFRESH_COOKIE_OPTIONS,
  sanitizeUser,
  buildSafeUserCookie,
} from "@/lib/auth/cookie-utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idToken, role = "client" } = body as {
      idToken?: string;
      role?: string;
    };

    if (!idToken) {
      return NextResponse.json(
        { message: "ID Token Google manquant" },
        { status: 400 },
      );
    }

    const backendRes = await fetch(`${API_URL}/login/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken, role }),
    });

    if (!backendRes.ok) {
      const err = await backendRes.json().catch(() => ({}));
      return NextResponse.json(
        { message: err.error ?? err.message ?? "Connexion Google échouée" },
        { status: backendRes.status },
      );
    }

    const data = await backendRes.json();
    const safeUser = sanitizeUser(data.utilisateur);

    const { roles, details } = await fetchUserRolesFromApi(
      safeUser._id,
      data.token,
    );

    const response = NextResponse.json({
      utilisateur: safeUser,
      roles,
      activeRole: roles[0] ?? "CLIENT",
      roleDetails: details,
    });

    const safeUserCookie = buildSafeUserCookie(safeUser);
    response.cookies.set(COOKIE_NAMES.token, data.token, COOKIE_OPTIONS);
    if (data.refreshToken) {
      response.cookies.set(
        COOKIE_NAMES.refreshToken,
        data.refreshToken,
        REFRESH_COOKIE_OPTIONS,
      );
    }
    response.cookies.set(
      COOKIE_NAMES.user,
      JSON.stringify(safeUserCookie),
      COOKIE_OPTIONS,
    );
    response.cookies.set(
      COOKIE_NAMES.roles,
      JSON.stringify(roles),
      COOKIE_OPTIONS,
    );

    return response;
  } catch (error) {
    console.error("[Google Login Error]", error);
    return NextResponse.json(
      { message: "Erreur serveur lors de la connexion Google" },
      { status: 500 },
    );
  }
}
