export interface RoleDetails {
  prestataire?: { id: string; verifier: boolean } | null;
  freelance?: { id: string; accountStatus?: string } | null;
  vendeur?: { id: string; verifier: boolean } | null;
}

export interface UserRolesResponse {
  roles: string[];
  details: RoleDetails;
}

export async function fetchUserRolesFromApi(
  userId: string,
  token: string,
  apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api",
): Promise<UserRolesResponse> {
  try {
    const res = await fetch(`${apiUrl}/utilisateur/${userId}/roles`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) {
      return { roles: ["CLIENT"], details: {} };
    }
    const data = await res.json();
    const roles: string[] = (
      Array.isArray(data) ? data : (data.roles ?? ["CLIENT"])
    ).map((r: string) => r.toUpperCase());
    if (!roles.includes("CLIENT")) roles.unshift("CLIENT");
    return {
      roles,
      details: (data.details ?? {}) as RoleDetails,
    };
  } catch {
    return { roles: ["CLIENT"], details: {} };
  }
}
