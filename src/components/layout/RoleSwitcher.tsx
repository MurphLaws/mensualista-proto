"use client";
import { ChevronDown, Building2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { ROLE_LABEL, ROLE_SUBTITLE, type Role } from "@/lib/role-shared";
import { getClientRole, onRoleChange, setClientRole } from "@/lib/role-client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";

const ICONS: Record<Role, React.ReactNode> = {
  EMPRESA: <Building2 size={16} />,
  PARTICULAR: <Sparkles size={16} />,
};

export function RoleSwitcher() {
  const router = useRouter();
  const [role, setRoleState] = useState<Role>("PARTICULAR");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setRoleState(getClientRole());
    return onRoleChange(setRoleState);
  }, []);

  function pick(next: Role) {
    setClientRole(next);
    setOpen(false);
    // Soft refresh server components so they pick up the new role header
    router.refresh();
  }

  return (
    <div className="relative" data-tour="role-switcher">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white py-1.5 pl-2 pr-3 text-sm font-medium text-ink-900 hover:border-brand-300",
        )}
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-50 text-brand-700">
          {ICONS[role]}
        </span>
        <span className="hidden sm:flex sm:flex-col sm:items-start sm:leading-tight">
          <span className="text-[11px] uppercase tracking-wide text-ink-400">Rol activo</span>
          <span>{ROLE_LABEL[role]}</span>
        </span>
        <span className="sm:hidden">{ROLE_LABEL[role]}</span>
        <ChevronDown size={14} className={cn("text-ink-400 transition", open && "rotate-180")} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-2 w-64 overflow-hidden rounded-2xl border border-ink-200 bg-white p-1.5 shadow-soft">
            <p className="px-3 pb-2 pt-1 text-[11px] uppercase tracking-wide text-ink-400">
              Cambiar de rol
            </p>
            {(Object.keys(ROLE_LABEL) as Role[]).map((r) => (
              <button
                type="button"
                key={r}
                onClick={() => pick(r)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm hover:bg-brand-50",
                  r === role && "bg-brand-50",
                )}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                  {ICONS[r]}
                </span>
                <span className="flex flex-col">
                  <span className="font-medium text-ink-900">{ROLE_LABEL[r]}</span>
                  <span className="text-xs text-ink-500">{ROLE_SUBTITLE[r]}</span>
                </span>
              </button>
            ))}
            <p className="px-3 pb-2 pt-3 text-xs text-ink-400">
              Demo sin login: cambia para probar cada flujo.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
