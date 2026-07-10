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

let isRefreshing = false;
let refreshQueue: Array<(tokenOrStatus: boolean) => void> = [];

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Si l'erreur est 401 et que ce n'est pas une page d'auth
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const pathname = window.location.pathname;
      const isAuthPage =
        pathname.startsWith("/connexion") || pathname.startsWith("/inscription");

      if (isAuthPage) {
        return Promise.reject(error);
      }

      // Si le renouvellement a déjà été tenté pour cette requête, on s'arrête
      if (originalRequest._retry) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (isRefreshing) {
        // Enfiler la requête en attente du résultat du refresh
        return new Promise((resolve, reject) => {
          refreshQueue.push((success) => {
            if (success) {
              resolve(apiClient(originalRequest));
            } else {
              reject(error);
            }
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshRes = await fetch("/api/auth/refresh", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (refreshRes.ok) {
          isRefreshing = false;
          // Libérer toutes les requêtes en attente
          refreshQueue.forEach((cb) => cb(true));
          refreshQueue = [];
          
          return apiClient(originalRequest);
        } else {
          isRefreshing = false;
          refreshQueue.forEach((cb) => cb(false));
          refreshQueue = [];

          // Redirection ou toast d'erreur
          const { toast } = await import("sonner");
          toast.error("Votre session a expiré. Veuillez vous reconnecter.", {
            action: {
              label: "Se connecter",
              onClick: () => {
                window.location.href = `/connexion?redirect=${encodeURIComponent(pathname)}`;
              },
            },
            duration: 8000,
          });

          return Promise.reject(error);
        }
      } catch (refreshError) {
        isRefreshing = false;
        refreshQueue.forEach((cb) => cb(false));
        refreshQueue = [];
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  },
);

export default apiClient;
