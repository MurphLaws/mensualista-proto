import { cn } from "@/lib/cn";

type Tone = "brand" | "neutral" | "success" | "warn" | "danger";

const tones: Record<Tone, string> = {
  brand: "bg-brand-50 text-brand-700",
  neutral: "bg-ink-100 text-ink-700",
  success: "bg-emerald-50 text-emerald-700",
  warn: "bg-amber-50 text-amber-700",
  danger: "bg-red-50 text-red-700",
};

export function Badge({
  children,
  tone = "brand",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
