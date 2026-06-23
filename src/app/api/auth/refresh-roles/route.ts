import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { fetchUserRolesFromApi } from "@/lib/auth/roles";

const ROLES_COOKIE = "user_roles";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const userRaw = cookieStore.get("user_data")?.value;

  if (!token || !userRaw) {
    return NextResponse.json({ message: "Non authentifié" }, { status: 401 });
  }

  try {
    const utilisateur = JSON.parse(userRaw) as { _id: string };
    const { roles, details } = await fetchUserRolesFromApi(
      utilisateur._id,
      token,
    );

    const response = NextResponse.json({
      roles,
      activeRole: roles[0] ?? "CLIENT",
      roleDetails: details,
    });
    response.cookies.set(ROLES_COOKIE, JSON.stringify(roles), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch {
    return NextResponse.json(
      { message: "Impossible de rafraîchir les rôles" },
      { status: 500 },
    );
  }
}