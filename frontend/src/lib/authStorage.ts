import type { AuthUser } from "@/types/auth";

const ACCESS = "pn_access_token";
const REFRESH = "pn_refresh_token";
const USER = "pn_user";

export function getAccessToken(): string | null {
  try {
    return sessionStorage.getItem(ACCESS);
  } catch {
    return null;
  }
}

export function getRefreshToken(): string | null {
  try {
    return sessionStorage.getItem(REFRESH);
  } catch {
    return null;
  }
}

export function saveAuthSession(accessToken: string, refreshToken: string, user: AuthUser): void {
  try {
    sessionStorage.setItem(ACCESS, accessToken);
    sessionStorage.setItem(REFRESH, refreshToken);
    sessionStorage.setItem(USER, JSON.stringify(user));
  } catch {
    /* ignore quota / private mode */
  }
}

export function clearAuthSession(): void {
  try {
    sessionStorage.removeItem(ACCESS);
    sessionStorage.removeItem(REFRESH);
    sessionStorage.removeItem(USER);
  } catch {
    /* ignore */
  }
}

export function loadStoredUser(): AuthUser | null {
  try {
    const raw = sessionStorage.getItem(USER);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function loadAuthSession(): { accessToken: string; refreshToken: string; user: AuthUser } | null {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();
  const user = loadStoredUser();
  if (!accessToken || !refreshToken || !user) return null;
  return { accessToken, refreshToken, user };
}
