import { cn } from "@/lib/cn";

export function EmptyState({
  title,
  hint,
  action,
  className,
}: {
  title: string;
  hint?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("card flex flex-col items-center gap-2 px-6 py-10 text-center", className)}>
      <div className="text-base font-semibold text-ink-900">{title}</div>
      {hint && <div className="max-w-md text-sm text-ink-500">{hint}</div>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
