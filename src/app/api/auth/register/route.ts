import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { AuthResponse, RegisterPayload } from "@/types";
import { fetchUserRolesFromApi } from "@/lib/auth/roles";
import {
  COOKIE_NAMES,
  COOKIE_OPTIONS,
  REFRESH_COOKIE_OPTIONS,
  sanitizeUser,
  buildSafeUserCookie,
} from "@/lib/auth/cookie-utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";

interface ExtendedAuthResponse extends AuthResponse {
  refreshToken?: string;
}

function setAuthCookies(
  response: NextResponse,
  auth: ExtendedAuthResponse,
  roles: string[],
) {
  const safeUser = buildSafeUserCookie(auth.utilisateur);
  response.cookies.set(COOKIE_NAMES.token, auth.token, COOKIE_OPTIONS);
  if (auth.refreshToken) {
    response.cookies.set(
      COOKIE_NAMES.refreshToken,
      auth.refreshToken,
      REFRESH_COOKIE_OPTIONS,
    );
  }
  response.cookies.set(
    COOKIE_NAMES.user,
    JSON.stringify(safeUser),
    COOKIE_OPTIONS,
  );
  response.cookies.set(
    COOKIE_NAMES.roles,
    JSON.stringify(roles),
    COOKIE_OPTIONS,
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RegisterPayload;
    // Backend exige PascalCase : "Client", "Prestataire", "Vendeur", "Freelance"
    const rolePascal =
      (body.role ?? "Client").charAt(0).toUpperCase() +
      (body.role ?? "Client").slice(1).toLowerCase();

    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, role: rolePascal }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const details =
        typeof err === "object" &&
        err &&
        "details" in err &&
        Array.isArray(err.details)
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
    // Supprimer les champs sensibles renvoyés par le backend
    const safeUser = sanitizeUser(auth.utilisateur);

    const { roles, details } = await fetchUserRolesFromApi(
      safeUser._id,
      auth.token,
    );

    const response = NextResponse.json({
      utilisateur: safeUser,
      roles,
      activeRole: roles[0] ?? "CLIENT",
      roleDetails: details,
    });
    setAuthCookies(response, { ...auth, utilisateur: safeUser }, roles);
    return response;
  } catch {
    return NextResponse.json(
      { message: "Erreur de connexion au serveur" },
      { status: 500 },
    );
  }
}

