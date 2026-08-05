import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();
    if (!token || !password) {
      return NextResponse.json(
        { error: "Token et mot de passe requis" },
        { status: 400 },
      );
    }

    const res = await fetch(`${API_URL}/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
