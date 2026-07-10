import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAMES, COOKIE_OPTIONS, REFRESH_COOKIE_OPTIONS } from "@/lib/auth/cookie-utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(COOKIE_NAMES.refreshToken)?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: "Session expirée." }, { status: 401 });
  }

  try {
    const res = await fetch(`${API_URL}/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      // Si le refresh token est invalide ou expiré, on nettoie tous les cookies de session
      const response = NextResponse.json(
        { error: "Session expirée, veuillez vous reconnecter." },
        { status: 401 }
      );
      response.cookies.delete(COOKIE_NAMES.token);
      response.cookies.delete(COOKIE_NAMES.user);
      response.cookies.delete(COOKIE_NAMES.roles);
      response.cookies.delete(COOKIE_NAMES.refreshToken);
      return response;
    }

    const { token, refreshToken: newRefreshToken } = await res.json();

    const response = NextResponse.json({ success: true });
    
    // Mettre à jour les cookies avec les nouveaux tokens
    response.cookies.set(COOKIE_NAMES.token, token, COOKIE_OPTIONS);
    if (newRefreshToken) {
      response.cookies.set(COOKIE_NAMES.refreshToken, newRefreshToken, REFRESH_COOKIE_OPTIONS);
    }
    
    return response;
  } catch (error) {
    console.error("Erreur refresh token BFF:", error);
    return NextResponse.json(
      { error: "Erreur de connexion au serveur d'authentification." },
      { status: 500 }
    );
  }
}
