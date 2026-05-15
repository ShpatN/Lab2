import type { AuthResponse, LoginRequestBody, RegisterRequestBody } from "@/types/auth";
import { apiUrl } from "@/lib/api";

async function parseAuthJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!res.ok) {
    let message = res.statusText;
    try {
      const j = JSON.parse(text) as { message?: string; Message?: string };
      if (j?.message) message = j.message;
      else if (j?.Message) message = j.Message;
    } catch {
      if (text) message = text;
    }
    throw new Error(message || `Request failed: ${res.status}`);
  }
  return JSON.parse(text) as T;
}

export async function postLogin(body: LoginRequestBody): Promise<AuthResponse> {
  const res = await fetch(apiUrl("/api/auth/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parseAuthJson<AuthResponse>(res);
}

export async function postRegister(body: RegisterRequestBody): Promise<AuthResponse> {
  const res = await fetch(apiUrl("/api/auth/register"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parseAuthJson<AuthResponse>(res);
}

export async function postLogout(refreshToken: string): Promise<void> {
  try {
    await fetch(apiUrl("/api/auth/logout"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
  } catch {
    /* network errors ignored — local session still cleared */
  }
}
