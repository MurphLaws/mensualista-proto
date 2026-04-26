"use client";
import type { Role } from "./role-shared";

const STORAGE_KEY = "mensualista.role";
const COOKIE_KEY = "mensualista_role";

function isRole(v: unknown): v is Role {
  return v === "EMPRESA" || v === "PARTICULAR";
}

function writeCookie(role: Role) {
  if (typeof document === "undefined") return;
  // 1 year, root path, SameSite=Lax so it travels with same-origin nav
  const maxAge = 60 * 60 * 24 * 365;
  document.cookie = `${COOKIE_KEY}=${role}; Max-Age=${maxAge}; Path=/; SameSite=Lax`;
}

function readCookie(): Role | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_KEY}=([^;]+)`));
  if (!match) return null;
  const v = decodeURIComponent(match[1]);
  return isRole(v) ? v : null;
}

export function getClientRole(): Role {
  if (typeof window === "undefined") return "PARTICULAR";
  const fromCookie = readCookie();
  if (fromCookie) return fromCookie;
  const v = window.localStorage.getItem(STORAGE_KEY);
  return isRole(v) ? v : "PARTICULAR";
}

export function setClientRole(role: Role) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, role);
  writeCookie(role);
  window.dispatchEvent(new CustomEvent("mensualista:role-change", { detail: role }));
}

export function onRoleChange(cb: (role: Role) => void) {
  if (typeof window === "undefined") return () => {};
  const handler = (e: Event) => cb((e as CustomEvent<Role>).detail);
  window.addEventListener("mensualista:role-change", handler);
  return () => window.removeEventListener("mensualista:role-change", handler);
}

// Sync localStorage → cookie on first load (in case localStorage has it but cookie doesn't yet)
export function ensureCookieSync() {
  if (typeof document === "undefined") return;
  if (readCookie()) return;
  const v = window.localStorage.getItem(STORAGE_KEY);
  writeCookie(isRole(v) ? v : "PARTICULAR");
}
