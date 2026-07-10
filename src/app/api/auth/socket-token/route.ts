import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAMES } from "@/lib/auth/cookie-utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";

/** Émet un JWT court dédié Socket.io (5 min) — ne pas exposer le token de session complet. */
export async function GET() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(COOKIE_NAMES.token)?.value;

  if (!sessionToken) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  try {
    const res = await fetch(`${API_URL}/socket-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { socketToken } = (await res.json()) as { socketToken: string };
    return NextResponse.json({ token: socketToken });
  } catch {
    return NextResponse.json(
      { error: "Erreur d'authentification socket." },
      { status: 500 },
    );
  }
}
