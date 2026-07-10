import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAMES } from "@/lib/auth/cookie-utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAMES.token)?.value;
  const refreshToken = cookieStore.get(COOKIE_NAMES.refreshToken)?.value;

  if (token || refreshToken) {
    try {
      await fetch(`${API_URL}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ refreshToken }),
      });
    } catch {
      // On nettoie les cookies même si le backend est injoignable
    }
  }

  const response = NextResponse.json({ success: true });
  response.cookies.delete(COOKIE_NAMES.token);
  response.cookies.delete(COOKIE_NAMES.user);
  response.cookies.delete(COOKIE_NAMES.roles);
  response.cookies.delete({ name: COOKIE_NAMES.refreshToken, path: "/api/auth" });
  return response;
}
