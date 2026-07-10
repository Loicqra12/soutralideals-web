import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import type { Utilisateur } from "@/types";
import {
  COOKIE_NAMES,
  COOKIE_OPTIONS,
  sanitizeUser,
  buildSafeUserCookie,
} from "@/lib/auth/cookie-utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";

export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAMES.token)?.value;
    const userRaw = cookieStore.get(COOKIE_NAMES.user)?.value;

    if (!token || !userRaw) {
      return NextResponse.json({ message: "Non authentifié" }, { status: 401 });
    }

    const currentUser = JSON.parse(userRaw) as Utilisateur;
    const contentType = request.headers.get("content-type") ?? "";
    const isMultipart = contentType.includes("multipart/form-data");

    const headers: HeadersInit = { Authorization: `Bearer ${token}` };
    let backendRes: Response;

    if (isMultipart) {
      const formData = await request.formData();
      backendRes = await fetch(`${API_URL}/utilisateur/${currentUser._id}`, {
        method: "PUT",
        headers,
        body: formData,
      });
    } else {
      const body = await request.json();
      headers["Content-Type"] = "application/json";
      backendRes = await fetch(`${API_URL}/utilisateur/${currentUser._id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(body),
      });
    }

    if (!backendRes.ok) {
      const error = await backendRes.json().catch(() => ({}));
      return NextResponse.json(
        { message: error.error ?? "Mise à jour impossible" },
        { status: backendRes.status },
      );
    }

    // Nettoyer les champs sensibles puis ne stocker que le payload minimal
    const rawUser = (await backendRes.json()) as Utilisateur;
    const utilisateur = sanitizeUser(rawUser);
    const safePayload = buildSafeUserCookie(utilisateur);

    const response = NextResponse.json({ utilisateur });
    response.cookies.set(
      COOKIE_NAMES.user,
      JSON.stringify(safePayload),
      COOKIE_OPTIONS,
    );
    return response;
  } catch {
    return NextResponse.json(
      { message: "Erreur lors de la mise à jour du profil" },
      { status: 500 },
    );
  }
}

