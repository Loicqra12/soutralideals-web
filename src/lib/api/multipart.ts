export async function postMultipart<T = unknown>(
  path: string,
  formData: FormData,
): Promise<T> {
  const cleanPath = path.replace(/^\//, "");
  const res = await fetch(`/api/backend/${cleanPath}`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const message =
      typeof err === "object" && err && "error" in err
        ? String((err as { error: string }).error)
        : typeof err === "object" && err && "message" in err
          ? String((err as { message: string }).message)
          : "Requête impossible";
    throw new Error(message);
  }

  return res.json() as Promise<T>;
}

export async function putMultipart<T = unknown>(
  path: string,
  formData: FormData,
): Promise<T> {
  const cleanPath = path.replace(/^\//, "");
  const res = await fetch(`/api/backend/${cleanPath}`, {
    method: "PUT",
    body: formData,
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      typeof err === "object" && err && "error" in err
        ? String((err as { error: string }).error)
        : "Mise à jour impossible",
    );
  }

  return res.json() as Promise<T>;
}
