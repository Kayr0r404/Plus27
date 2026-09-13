export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  avatar_url: string | null;
  sex: "Male" | "Female" | null;
}

export interface CreateUserPayload {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  username: string;
  avatar_url?: string | null;
  sex?: "Male" | "Female" | null;
}

export interface UpdateUserPayload {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  avatar_url?: string | null;
  sex?: "Male" | "Female" | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

function extractDetail(payload: unknown): string {
  if (
    payload &&
    typeof payload === "object" &&
    "detail" in payload &&
    typeof (payload as { detail: unknown }).detail === "string"
  ) {
    return (payload as { detail: string }).detail;
  }
  if (Array.isArray(payload)) {
    return payload
      .map((err) =>
        err && typeof err === "object" && "msg" in err
          ? (err as { msg: string }).msg
          : String(err),
      )
      .join(", ");
  }
  return "Something went wrong.";
}

interface ApiFetchOptions extends RequestInit {
  skipCsrf?: boolean;
}

async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const method = (options.method ?? "GET").toUpperCase();
  const isSafeMethod = ["GET", "HEAD", "OPTIONS"].includes(method);
  const headers = new Headers(options.headers);

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (options.skipCsrf !== true && !isSafeMethod) {
    const csrf = getCookie("csrf_token");
    if (csrf) headers.set("X-CSRF-Token", csrf);
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  const payload: unknown = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(extractDetail(payload), res.status);
  }

  return payload as T;
}

export async function registerUser(
  payload: CreateUserPayload,
): Promise<User> {
  return apiFetch<User>("/users/register-new-account", {
    method: "POST",
    body: JSON.stringify(payload),
    skipCsrf: true,
  });
}

export async function login(payload: LoginPayload): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/auth/token", {
    method: "POST",
    body: JSON.stringify(payload),
    skipCsrf: true,
  });
}

export async function logout(): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/auth/logout", {
    method: "DELETE",
  });
}

export async function getMe(): Promise<User> {
  return apiFetch<User>("/auth/me");
}

export async function updateUser(
  user: UpdateUserPayload,
): Promise<User> {
  return apiFetch<User>(`/users/update/${user.id}`, {
    method: "PUT",
    body: JSON.stringify(user),
  });
}

export async function deleteUser(userId: string): Promise<boolean> {
  return apiFetch<boolean>(`/users/delete/${userId}`, {
    method: "DELETE",
  });
}