import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import type { Utilisateur } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";
const USER_COOKIE = "user_data";

function sanitizeUser(user: Utilisateur & { password?: string; tokens?: unknown }) {
  const safe = { ...user };
  delete safe.password;
  delete safe.tokens;
  return safe;
}

export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    const userRaw = cookieStore.get(USER_COOKIE)?.value;

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

    const utilisateur = sanitizeUser(
      (await backendRes.json()) as Utilisateur & { password?: string },
    );

    const response = NextResponse.json({ utilisateur });
    response.cookies.set(USER_COOKIE, JSON.stringify(utilisateur), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch {
    return NextResponse.json(
      { message: "Erreur lors de la mise à jour du profil" },
      { status: 500 },
    );
  }
}
