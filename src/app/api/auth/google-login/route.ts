import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "";

/**
 * POST /api/auth/google-login
 * Authentifie l'utilisateur avec Google OAuth (compte existant)
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { idToken } = body;

    if (!idToken) {
      return NextResponse.json(
        { message: "ID Token manquant" },
        { status: 400 },
      );
    }

    // Appel au backend Node.js
    const backendRes = await fetch(`${API_URL}/api/utilisateurs/login/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idToken,
        role: "client"
      }),
    });

    if (!backendRes.ok) {
      const error = await backendRes.json().catch(() => ({}));
      return NextResponse.json(
        { message: error.message || error.error || "Connexion Google échouée" },
        { status: backendRes.status },
      );
    }

    const data = await backendRes.json();

    // Stocker le token dans un cookie httpOnly
    const cookieStore = await cookies();
    cookieStore.set("authToken", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 jours
      path: "/",
    });

    if (data.refreshToken) {
      cookieStore.set("refreshToken", data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 jours
        path: "/",
      });
    }

    return NextResponse.json({
      utilisateur: data.utilisateur,
      roles: [data.utilisateur.role || "CLIENT"],
      activeRole: data.utilisateur.role || "CLIENT",
      roleDetails: {},
    });
  } catch (error) {
    console.error("[Google Login Error]", error);
    return NextResponse.json(
      { message: "Erreur serveur lors de la connexion Google" },
      { status: 500 },
    );
  }
}
