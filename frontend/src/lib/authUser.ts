import type { AppRole, AuthUser } from "@/types/auth";

export function authDisplayName(user: AuthUser): string {
  const f = user.firstName?.trim() ?? "";
  const l = user.lastName?.trim() ?? "";
  if (f && l) return `${f} ${l}`;
  return f || l || user.email;
}

export function authAvatarUrl(user: AuthUser): string {
  const seed = encodeURIComponent(user.email || String(user.id));
  return `https://i.pravatar.cc/150?u=${seed}`;
}

/** Map backend role names to dashboard routing. */
export function authAppRole(user: AuthUser): AppRole {
  const r = (user.roles ?? []).map((x) => x.toLowerCase());
  if (r.some((x) => x.includes("admin"))) return "admin";
  if (r.some((x) => x.includes("owner") || x.includes("venue"))) return "owner";
  return "customer";
}

export function dashboardPathForUser(user: AuthUser): string {
  const role = authAppRole(user);
  if (role === "admin") return "/admin/dashboard";
  if (role === "owner") return "/owner/dashboard";
  return "/dashboard";
}

/** Match mock reservation/ticket userId (e.g. u1) to numeric API user id 1. */
export function matchesMockUserId(mockUserId: string, authUserId: number | undefined): boolean {
  if (authUserId === undefined) return false;
  return mockUserId === String(authUserId) || mockUserId === `u${authUserId}`;
}
