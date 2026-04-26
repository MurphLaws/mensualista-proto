"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Compass,
  Ticket,
  PartyPopper,
  LayoutGrid,
  QrCode,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";
import type { Role } from "@/lib/role-shared";
import { getClientRole, onRoleChange } from "@/lib/role-client";

type Item = { href: string; label: string; Icon: LucideIcon };

const ITEMS_BY_ROLE: Record<Role, Item[]> = {
  PARTICULAR: [
    { href: "/explorar", label: "Explorar", Icon: Compass },
    { href: "/mis-entradas", label: "Entradas", Icon: Ticket },
    { href: "/particular", label: "Eventos", Icon: PartyPopper },
    { href: "/settings", label: "Ajustes", Icon: Settings },
  ],
  EMPRESA: [
    { href: "/explorar", label: "Explorar", Icon: Compass },
    { href: "/empresa", label: "Panel", Icon: LayoutGrid },
    { href: "/empresa/scanner", label: "Scanner", Icon: QrCode },
    { href: "/settings", label: "Ajustes", Icon: Settings },
  ],
};

export function BottomNav() {
  const pathname = usePathname();
  const [role, setRole] = useState<Role>("PARTICULAR");

  useEffect(() => {
    setRole(getClientRole());
    return onRoleChange(setRole);
  }, []);

  if (pathname === "/") return null;

  const items = ITEMS_BY_ROLE[role];

  return (
    <nav
      aria-label="Navegación principal"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-100 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur"
    >
      <ul className="mx-auto flex max-w-3xl items-stretch justify-around">
        {items.map(({ href, label, Icon }) => {
          const active =
            href === "/empresa"
              ? pathname === "/empresa"
              : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium",
                  active ? "text-brand-700" : "text-ink-500 hover:text-ink-900",
                )}
              >
                <Icon
                  size={22}
                  strokeWidth={active ? 2.4 : 1.8}
                  aria-hidden="true"
                />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
