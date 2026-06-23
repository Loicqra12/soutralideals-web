import { NextResponse } from "next/server";

const COOKIE_NAME = "auth_token";
const USER_COOKIE = "user_data";
const ROLES_COOKIE = "user_roles";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(COOKIE_NAME);
  response.cookies.delete(USER_COOKIE);
  response.cookies.delete(ROLES_COOKIE);
  return response;
}
