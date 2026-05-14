import type { EventApi, EventSearchParams, VenueApi, VenueSearchParams } from "@/types/venueEvent";
import type {
  CreateReservationBody,
  ReservationListItem,
  ReservationStatusUpdateResult,
  UpdateReservationStatusBody,
} from "@/types/reservation";
import type { NotificationItem } from "@/types/notification";
import type { CreatePaymentDTO, CreatePaymentIntentBody, PaymentIntentResponse } from "@/types/payment";
import { getAccessToken } from "@/lib/authStorage";

/**
 * API origin without trailing slash. When empty, paths stay relative (dev: Vite `server.proxy` forwards `/api`).
 * Set `VITE_API_BASE_URL` when the API is on another origin and you are not using the proxy.
 */
export function getApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_BASE_URL as string | undefined;
  if (raw == null || String(raw).trim() === "") return "";
  return String(raw).trim().replace(/\/$/, "");
}

/** Absolute or same-origin URL for an API path (must start with `/`). */
export function apiUrl(path: string): string {
  const base = getApiBaseUrl();
  const p = path.startsWith("/") ? path : `/${path}`;
  return base ? `${base}${p}` : p;
}

/** Authenticated fetch: sends Bearer token when present. */
export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const token = getAccessToken();
  const headers = new Headers(init?.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (init?.body != null && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  return fetch(apiUrl(path), { ...init, headers });
}

async function parseJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    let message = res.statusText;
    try {
      const j = JSON.parse(text) as { message?: string };
      if (j?.message) message = j.message;
    } catch {
      if (text) message = text;
    }
    throw new Error(message || `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

function toQueryString(params: Record<string, string | undefined>): string {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v != null && v !== "") qs.set(k, v);
  }
  const raw = qs.toString();
  return raw ? `?${raw}` : "";
}

export async function fetchVenues(params: VenueSearchParams = {}): Promise<VenueApi[]> {
  const query = toQueryString({
    keyword: params.keyword,
    category: params.category,
    sortBy: params.sortBy,
    sortDirection: params.sortDirection,
  });
  const res = await apiFetch(`/api/venues${query}`);
  return parseJson<VenueApi[]>(res);
}

export async function fetchVenueById(id: number): Promise<VenueApi> {
  const res = await apiFetch(`/api/venues/${id}`);
  return parseJson<VenueApi>(res);
}

export async function fetchEvents(params: EventSearchParams = {}): Promise<EventApi[]> {
  const query = toQueryString({
    keyword: params.keyword,
    category: params.category,
    sortBy: params.sortBy,
    sortDirection: params.sortDirection,
    dateFrom: params.dateFrom,
    dateTo: params.dateTo,
    timeFrom: params.timeFrom,
  });
  const res = await apiFetch(`/api/events${query}`);
  return parseJson<EventApi[]>(res);
}

export async function fetchEventById(id: number): Promise<EventApi> {
  const res = await apiFetch(`/api/events/${id}`);
  return parseJson<EventApi>(res);
}

export async function fetchEventCategories(): Promise<Array<{ id: number; name: string }>> {
  const res = await apiFetch("/api/EventCategory");
  return parseJson<Array<{ id: number; name: string }>>(res);
}

export type CreateVenueBody = {
  name: string;
  description: string;
  address: string;
  city: string;
  category: string;
  ownerId: number;
  isActive: boolean;
};

export type UpdateVenueBody = CreateVenueBody;

export async function createVenue(body: CreateVenueBody): Promise<VenueApi> {
  const res = await apiFetch("/api/venues", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return parseJson<VenueApi>(res);
}

export async function updateVenue(id: number, body: UpdateVenueBody): Promise<VenueApi> {
  const res = await apiFetch(`/api/venues/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  return parseJson<VenueApi>(res);
}

export type CreateEventBody = {
  venueId: number;
  categoryId?: number | null;
  name: string;
  description: string;
  startDate: string;
  endDate?: string | null;
  isActive: boolean;
};

export type UpdateEventBody = CreateEventBody;

export async function createEvent(body: CreateEventBody): Promise<EventApi> {
  const res = await apiFetch("/api/events", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return parseJson<EventApi>(res);
}

export async function updateEvent(id: number, body: UpdateEventBody): Promise<EventApi> {
  const res = await apiFetch(`/api/events/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  return parseJson<EventApi>(res);
}

export async function fetchMyReservations(asVenueOwner = false): Promise<ReservationListItem[]> {
  const q = asVenueOwner ? "?asVenueOwner=true" : "";
  const res = await apiFetch(`/api/reservations${q}`);
  return parseJson<ReservationListItem[]>(res);
}

export async function createReservation(body: CreateReservationBody): Promise<{ reservationId: number }> {
  const res = await apiFetch("/api/reservations", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return parseJson<{ reservationId: number }>(res);
}

export async function updateReservationStatus(
  reservationId: number,
  body: UpdateReservationStatusBody,
): Promise<ReservationStatusUpdateResult> {
  const res = await apiFetch(`/api/reservations/${reservationId}/status`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  return parseJson<ReservationStatusUpdateResult>(res);
}

export async function fetchNotifications(): Promise<NotificationItem[]> {
  const token = getAccessToken();
  if (!token) return [];
  const res = await apiFetch("/api/notifications");
  if (res.status === 401) return [];
  return parseJson<NotificationItem[]>(res);
}

export async function markNotificationRead(id: string): Promise<boolean> {
  const token = getAccessToken();
  if (!token) return false;
  const res = await apiFetch(`/api/notifications/${id}/read`, { method: "PUT" });
  if (res.status === 401) return false;
  if (res.status === 404) return false;
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to mark notification as read");
  }
  return true;
}

export async function createPaymentIntent(body: CreatePaymentIntentBody): Promise<PaymentIntentResponse> {
  const res = await apiFetch("/api/stripe/payment-intent", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return parseJson<PaymentIntentResponse>(res);
}

export async function createPaymentRecord(body: CreatePaymentDTO): Promise<{ paymentId: number }> {
  const res = await apiFetch("/api/Payment", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return parseJson<{ paymentId: number }>(res);
}

export type ExportDataset = "reservations" | "payments" | "events";
export type ExportFormat = "csv" | "json";
export type ExportScope = "mine" | "venue" | "all";

export async function downloadExport(dataset: ExportDataset, format: ExportFormat, scope: ExportScope): Promise<void> {
  const query = toQueryString({ format, scope });
  const res = await apiFetch(`/api/exports/${dataset}${query}`);
  if (!res.ok) {
    const raw = await res.text();
    let message = `Failed to export ${dataset}`;
    try {
      const parsed = JSON.parse(raw) as { message?: string; title?: string; detail?: string };
      message = parsed.message || parsed.title || parsed.detail || message;
    } catch {
      if (raw) message = raw;
    }
    console.error("Export request failed", {
      dataset,
      format,
      scope,
      status: res.status,
      statusText: res.statusText,
      responseBody: raw,
    });
    throw new Error(message);
  }

  const blob = await res.blob();
  const cd = res.headers.get("content-disposition") ?? "";
  const fileNameMatch = cd.match(/filename="?([^"]+)"?/i);
  const fileName = fileNameMatch?.[1] ?? `${dataset}.${format}`;

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
