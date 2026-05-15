import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { AuthResponse, AuthUser } from "@/types/auth";
import { clearAuthSession, getRefreshToken, loadAuthSession, saveAuthSession } from "@/lib/authStorage";
import { postLogout } from "@/lib/authApi";

interface AuthContextType {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  /** Apply tokens + user after login/register (e.g. TanStack Query onSuccess). */
  applyAuthResponse: (data: AuthResponse) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const [session, setSession] = useState<{
    user: AuthUser | null;
    accessToken: string | null;
    refreshToken: string | null;
  }>(() => {
    const loaded = loadAuthSession();
    if (!loaded) return { user: null, accessToken: null, refreshToken: null };
    return {
      user: loaded.user,
      accessToken: loaded.accessToken,
      refreshToken: loaded.refreshToken,
    };
  });

  const applyAuthResponse = useCallback((data: AuthResponse) => {
    saveAuthSession(data.accessToken, data.refreshToken, data.user);
    setSession({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      user: data.user,
    });
  }, []);

  const logout = useCallback(async () => {
    const rt = getRefreshToken();

    // Optimistic logout: remove access immediately so UI/routing updates instantly.
    clearAuthSession();
    setSession({ user: null, accessToken: null, refreshToken: null });

    // Run expensive cleanup in background to avoid blocking navigation.
    setTimeout(() => {
      queryClient.clear();
    }, 0);

    if (rt) {
      void postLogout(rt).catch(() => {
        // Token may already be invalid/expired; local logout is already complete.
      });
    }
  }, [queryClient]);

  const value = useMemo<AuthContextType>(
    () => ({
      user: session.user,
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      isAuthenticated: !!(session.user && session.accessToken && session.refreshToken),
      applyAuthResponse,
      logout,
    }),
    [session, applyAuthResponse, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
