import { cn } from "@/lib/cn";

export function Stat({
  value,
  label,
  className,
  dense,
}: {
  value: React.ReactNode;
  label: string;
  className?: string;
  dense?: boolean;
}) {
  if (dense) {
    return (
      <div className={cn("flex flex-col text-left", className)}>
        <span className="text-[11px] uppercase tracking-wide text-ink-400">{label}</span>
        <span className="text-sm font-semibold text-ink-900">{value}</span>
      </div>
    );
  }
  return (
    <div className={cn("rounded-2xl bg-brand-50/70 px-5 py-4 text-center", className)}>
      <div className="text-2xl font-semibold tracking-tight text-ink-900">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-wide text-ink-500">{label}</div>
    </div>
  );
}
