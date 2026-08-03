import { create } from "zustand";
import type { Utilisateur } from "@/types";
import type { RoleDetails } from "@/lib/auth/roles";
import { getSession, login as apiLogin, logout as apiLogout, register as apiRegister, refreshRoles as apiRefreshRoles } from "@/lib/api/auth";
import { loginWithGoogle as apiLoginWithGoogle } from "@/lib/auth/google-auth";
import { updateProfile as apiUpdateProfile } from "@/lib/api/utilisateurs";
import type { UpdateProfilePayload } from "@/lib/api/utilisateurs";
import type { LoginPayload, RegisterPayload } from "@/types";

interface AuthStore {
  utilisateur: Utilisateur | null;
  roles: string[];
  roleDetails: RoleDetails;
  activeRole: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  hydrate: () => Promise<void>;
  login: (payload: LoginPayload) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshRoles: () => Promise<void>;
  updateProfile: (payload: UpdateProfilePayload) => Promise<void>;
  switchRole: (role: string) => void;
  hasRole: (role: string) => boolean;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  utilisateur: null,
  roles: [],
  roleDetails: {},
  activeRole: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  hydrate: async () => {
    set({ isLoading: true, error: null });
    try {
      const session = await getSession();
      if (session) {
        set({
          utilisateur: session.utilisateur,
          roles: session.roles,
          roleDetails: session.roleDetails ?? {},
          activeRole: session.activeRole,
          isAuthenticated: true,
          isLoading: false,
        });
        // Rafraîchir les rôles en arrière-plan (évite de bloquer le premier rendu)
        apiRefreshRoles()
          .then(({ roles, roleDetails }) => {
            set({
              roles: roles.map((r) => r.toUpperCase()),
              roleDetails: roleDetails ?? {},
              activeRole: roles[0] ?? "CLIENT",
            });
          })
          .catch(() => {
            // Garde les rôles issus de la session cookie
          });
      } else {
        set({ isLoading: false, isAuthenticated: false });
      }
    } catch {
      set({ isLoading: false, isAuthenticated: false });
    }
  },

  login: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const session = await apiLogin(payload);
      set({
        utilisateur: session.utilisateur,
        roles: session.roles,
        roleDetails: session.roleDetails ?? {},
        activeRole: session.activeRole,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Connexion impossible";
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  loginWithGoogle: async (idToken) => {
    set({ isLoading: true, error: null });
    try {
      const session = await apiLoginWithGoogle(idToken);
      set({
        utilisateur: session.utilisateur,
        roles: session.roles,
        roleDetails: session.roleDetails ?? {},
        activeRole: session.activeRole,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Connexion Google impossible";
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  register: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const session = await apiRegister(payload);
      set({
        utilisateur: session.utilisateur,
        roles: session.roles,
        roleDetails: session.roleDetails ?? {},
        activeRole: session.activeRole,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Inscription impossible";
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    await apiLogout();
    set({
      utilisateur: null,
      roles: [],
      roleDetails: {},
      activeRole: null,
      isAuthenticated: false,
      error: null,
    });
  },

  refreshRoles: async () => {
    const { roles, roleDetails } = await apiRefreshRoles();
    const normalized = roles.map((r) => r.toUpperCase());
    set({
      roles: normalized,
      roleDetails: roleDetails ?? {},
      activeRole: normalized[0] ?? "CLIENT",
    });
  },

  updateProfile: async (payload) => {
    const utilisateur = await apiUpdateProfile(payload);
    set({ utilisateur });
  },

  switchRole: (role) => {
    const { roles } = get();
    if (roles.includes(role)) set({ activeRole: role });
  },

  hasRole: (role) => get().roles.includes(role.toUpperCase()),
}));
