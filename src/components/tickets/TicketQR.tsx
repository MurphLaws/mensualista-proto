"use client";
import { useEffect, useState } from "react";
import { Copy, Check } from "lucide-react";
import { qrToDataUrl } from "@/lib/qr";

export function TicketQR({ code }: { code: string }) {
  const [src, setSrc] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let alive = true;
    qrToDataUrl(code).then((url) => {
      if (alive) setSrc(url);
    });
    return () => {
      alive = false;
    };
  }, [code]);

  async function copy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  return (
    <div className="flex flex-col items-center gap-3" data-tour="ticket.qr">
      <div className="rounded-2xl border border-ink-200 bg-white p-3">
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="QR del ticket" width={280} height={280} className="block" />
        ) : (
          <div className="h-[280px] w-[280px] animate-pulse bg-ink-100" />
        )}
      </div>
      <button
        type="button"
        onClick={copy}
        className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white px-3 py-1.5 text-xs font-medium text-ink-700 hover:border-brand-300"
        title="Copiar codigo del ticket"
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
        <span className="font-mono">{code}</span>
      </button>
      <p className="text-xs text-ink-500">
        Para hacer demo en una sola maquina, copia este codigo y pegalo en el scanner.
      </p>
    </div>
  );
}
