import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAMES } from "@/lib/auth/cookie-utils";

export async function GET() {
  const cookieStore = await cookies();
  const userData = cookieStore.get(COOKIE_NAMES.user)?.value;
  const rolesData = cookieStore.get(COOKIE_NAMES.roles)?.value;
  const token = cookieStore.get(COOKIE_NAMES.token)?.value;

  if (!token || !userData) {
    return NextResponse.json(null);
  }

  try {
    const utilisateur = JSON.parse(userData);
    const roles: string[] = rolesData ? JSON.parse(rolesData) : ["CLIENT"];
    return NextResponse.json({
      utilisateur,
      roles,
      activeRole: roles[0] ?? "CLIENT",
      // roleDetails n'est pas stocké en cookie pour limiter la taille :
      // le store Zustand le rafraîchit en background via /api/auth/refresh-roles
      roleDetails: {},
    });
  } catch {
    return NextResponse.json(null);
  }
}

