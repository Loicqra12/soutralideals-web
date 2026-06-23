import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const COOKIE_NAME = "auth_token";
const USER_COOKIE = "user_data";
const ROLES_COOKIE = "user_roles";

export async function GET() {
  const cookieStore = await cookies();
  const userData = cookieStore.get(USER_COOKIE)?.value;
  const rolesData = cookieStore.get(ROLES_COOKIE)?.value;
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token || !userData) {
    return NextResponse.json(null);
  }

  try {
    const utilisateur = JSON.parse(userData);
    const roles = rolesData ? JSON.parse(rolesData) : ["CLIENT"];
    return NextResponse.json({
      utilisateur,
      roles,
      activeRole: roles[0] ?? "CLIENT",
    });
  } catch {
    return NextResponse.json(null);
  }
}
