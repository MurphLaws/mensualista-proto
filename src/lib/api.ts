"use client";
import { getClientRole } from "./role-client";

export async function api<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const role = getClientRole();
  const res = await fetch(path, {
    ...init,
    headers: {
      "content-type": "application/json",
      "x-mensualista-role": role,
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });
  if (!res.ok) {
    let body = "";
    try {
      body = await res.text();
    } catch {}
    throw new Error(`API ${res.status}: ${body || res.statusText}`);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
