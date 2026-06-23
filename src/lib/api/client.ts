import axios from "axios";

// En navigateur → proxy Next.js relatif
// En SSR/SSG → ne pas utiliser ce client (tous les hooks sont "use client")
const isServer = typeof window === "undefined";
const BASE_URL = isServer
  ? `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001"}/api/backend`
  : "/api/backend";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const pathname = window.location.pathname;
      const isAuthPage =
        pathname.startsWith("/connexion") || pathname.startsWith("/inscription");

      if (!isAuthPage) {
        window.location.href = `/connexion?redirect=${encodeURIComponent(pathname)}`;
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
