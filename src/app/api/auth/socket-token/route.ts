import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const COOKIE_NAME = "auth_token";

/** Expose le JWT au client pour l'auth Socket.io (same-origin, session active). */
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  return NextResponse.json({ token });
}
