"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { getClientRole, onRoleChange } from "@/lib/role-client";
import type { Role } from "@/lib/role-shared";
import { RoleSwitcher } from "./RoleSwitcher";
import { TutorialReplayButton } from "@/components/tutorial/TutorialReplayButton";

const NAV_BY_ROLE: Record<Role, { href: string; label: string }[]> = {
  VISITANTE: [
    { href: "/explorar", label: "Explorar" },
    { href: "/mis-entradas", label: "Mis entradas" },
  ],
  EMPRESA: [
    { href: "/explorar", label: "Explorar" },
    { href: "/empresa", label: "Panel" },
    { href: "/empresa/scanner", label: "Scanner" },
  ],
  PARTICULAR: [
    { href: "/explorar", label: "Explorar" },
    { href: "/particular", label: "Mis eventos" },
  ],
};

export function Header() {
  const pathname = usePathname();
  const [role, setRole] = useState<Role>("VISITANTE");

  useEffect(() => {
    setRole(getClientRole());
    return onRoleChange(setRole);
  }, []);

  const onLanding = pathname === "/";
  const nav = onLanding ? [] : NAV_BY_ROLE[role];

  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 bg-white/80 backdrop-blur">
      <div className="container-app flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Mensualista" width={28} height={28} />
          <span className="text-base font-semibold text-ink-900">Mensualista</span>
        </Link>

        {nav.length > 0 && (
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                data-tour={
                  item.label === "Explorar"
                    ? "nav.explorar"
                    : item.label === "Scanner"
                      ? "nav.scanner"
                      : undefined
                }
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm font-medium text-ink-700 hover:bg-ink-100",
                  pathname.startsWith(item.href) && "bg-brand-50 text-brand-700",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-2">
          <TutorialReplayButton />
          <RoleSwitcher />
        </div>
      </div>
    </header>
  );
}
