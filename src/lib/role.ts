import "server-only";
import { cookies, headers } from "next/headers";
import { db } from "./db";
import { ROLE_TO_USER_ID, type Role } from "./role-shared";

export {
  type Role,
  ROLE_TO_USER_ID,
  ROLE_LABEL,
  ROLE_SUBTITLE,
} from "./role-shared";

function isRole(v: unknown): v is Role {
  return v === "EMPRESA" || v === "PARTICULAR";
}

export async function getActiveRoleFromHeaders(): Promise<Role> {
  const h = await headers();
  const fromHeader = h.get("x-mensualista-role");
  if (isRole(fromHeader)) return fromHeader;
  const c = await cookies();
  const fromCookie = c.get("mensualista_role")?.value;
  if (isRole(fromCookie)) return fromCookie;
  return "PARTICULAR";
}

export async function getActiveUser() {
  const role = await getActiveRoleFromHeaders();
  const user = await db.user.findUnique({ where: { id: ROLE_TO_USER_ID[role] } });
  if (!user) throw new Error(`Usuario seed no encontrado para rol ${role}`);
  return user;
}
