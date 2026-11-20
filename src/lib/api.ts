import { authClient } from "./auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

// Tokens live 15 minutes. Cache one in memory and refresh shortly before it expires.
let cached: { token: string; expiresAt: number } | null = null;

export function clearTokenCache() {
  cached = null;
}

async function getToken(): Promise<string | null> {
  if (cached && cached.expiresAt - 30_000 > Date.now()) return cached.token;

  const { data } = await authClient.token();
  if (!data?.token) {
    cached = null;
    return null;
  }
  const payload = JSON.parse(
    atob(data.token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
  );
  cached = { token: data.token, expiresAt: payload.exp * 1000 };
  return data.token;
}

type Options = Omit<RequestInit, "body"> & { auth?: boolean; body?: unknown };

/** Public call: api("/api/services"). Private call: api("/api/bookings/my", { auth: true }). */
export async function api<T>(path: string, options: Options = {}, retried = false): Promise<T> {
  const { auth = false, body, headers, ...rest } = options;
  const isForm = typeof FormData !== "undefined" && body instanceof FormData;

  const h = new Headers(headers);
  if (body !== undefined && !isForm) h.set("Content-Type", "application/json");
  // For FormData the browser sets the multipart boundary itself, so no Content-Type here

  if (auth) {
    const token = await getToken();
    if (!token) throw new ApiError("Please sign in again", 401);
    h.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: h,
    body: body === undefined ? undefined : isForm ? (body as FormData) : JSON.stringify(body),
  });

  if (res.status === 401 && auth && !retried) {
    clearTokenCache();
    return api<T>(path, options, true);
  }

  const data = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(data?.message || "Request failed", res.status);
  return data as T;
}
