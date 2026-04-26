"use client";
import { useEffect, useRef, useState } from "react";
import { CheckCircle2, AlertTriangle, XCircle, Camera, CameraOff } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";

type ScanResult = {
  result: "OK" | "DUP" | "INVALID" | "EXHAUSTED";
  message?: string;
  listingTitle?: string;
  holderName?: string;
  remaining?: number;
  listingType?: string;
};

type ScanFeedItem = {
  id: string;
  result: string;
  scannedAt: string;
  ticket: { listing: { title: string }; holder: { name: string } };
};

const RESULT_TONE: Record<string, string> = {
  OK: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  DUP: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  EXHAUSTED: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  INVALID: "bg-red-50 text-red-700 ring-1 ring-red-200",
};

const ICONS: Record<string, React.ReactNode> = {
  OK: <CheckCircle2 size={20} />,
  DUP: <AlertTriangle size={20} />,
  EXHAUSTED: <AlertTriangle size={20} />,
  INVALID: <XCircle size={20} />,
};

export function QrScanner() {
  const containerId = "qr-reader";
  const html5Ref = useRef<unknown>(null);
  const lastCodeRef = useRef<{ code: string; at: number } | null>(null);
  const [feed, setFeed] = useState<ScanFeedItem[]>([]);
  const [last, setLast] = useState<ScanResult | null>(null);
  const [manualCode, setManualCode] = useState("");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraOn, setCameraOn] = useState(false);

  async function refreshFeed() {
    try {
      const items = await api<ScanFeedItem[]>("/api/scan");
      setFeed(items);
    } catch {}
  }

  useEffect(() => {
    refreshFeed();
  }, []);

  // Mount html5-qrcode dynamically (client-only library)
  useEffect(() => {
    let cancelled = false;
    let scanner: { stop?: () => Promise<void>; clear?: () => void } | null = null;

    (async () => {
      try {
        const mod = await import("html5-qrcode");
        if (cancelled) return;
        const Html5Qrcode = mod.Html5Qrcode;
        const inst = new Html5Qrcode(containerId);
        html5Ref.current = inst;
        scanner = inst as unknown as { stop?: () => Promise<void>; clear?: () => void };
        try {
          await inst.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: 240 },
            async (decoded: string) => {
              const now = Date.now();
              if (lastCodeRef.current && lastCodeRef.current.code === decoded && now - lastCodeRef.current.at < 1500) {
                return; // debounce same code
              }
              lastCodeRef.current = { code: decoded, at: now };
              await processScan(decoded);
            },
            () => {
              // ignore decode errors
            },
          );
          if (!cancelled) setCameraOn(true);
        } catch (err) {
          if (!cancelled) setCameraError(`No pudimos acceder a la camara. ${(err as Error)?.message ?? ""}`);
        }
      } catch (err) {
        if (!cancelled)
          setCameraError(`No se pudo cargar el lector de QR. ${(err as Error)?.message ?? ""}`);
      }
    })();

    return () => {
      cancelled = true;
      try {
        scanner?.stop?.().catch(() => {});
        scanner?.clear?.();
      } catch {}
    };
  }, []);

  async function processScan(code: string) {
    try {
      const r = await api<ScanResult>("/api/scan", {
        method: "POST",
        body: JSON.stringify({ code }),
      });
      setLast(r);
      refreshFeed();
    } catch (err) {
      setLast({ result: "INVALID", message: (err as Error)?.message });
    }
  }

  async function submitManual(e: React.FormEvent) {
    e.preventDefault();
    if (!manualCode.trim()) return;
    await processScan(manualCode.trim());
    setManualCode("");
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_1fr]">
      {/* Camera + last result */}
      <div className="space-y-4">
        <div className="card overflow-hidden" data-tour="scanner.camera">
          <div className="flex items-center justify-between bg-ink-50 px-5 py-3">
            <div className="flex items-center gap-2 text-sm font-medium text-ink-700">
              {cameraOn ? <Camera size={16} /> : <CameraOff size={16} />}
              {cameraOn ? "Camara en vivo" : "Camara no disponible"}
            </div>
            <span className="text-xs text-ink-500">Apunta al QR del visitante</span>
          </div>
          <div className="relative bg-ink-900">
            <div id={containerId} className="mx-auto aspect-square w-full max-w-md" />
            {cameraError && (
              <div className="absolute inset-0 flex items-center justify-center bg-ink-900/90 px-6 text-center text-sm text-white">
                {cameraError} Usa el campo manual de la derecha.
              </div>
            )}
          </div>
        </div>

        {last && (
          <div className={`rounded-2xl px-5 py-4 ${RESULT_TONE[last.result]}`}>
            <div className="flex items-center gap-2 text-sm font-semibold">
              {ICONS[last.result]}
              {last.result === "OK" && "Acceso autorizado"}
              {last.result === "DUP" && "Ticket ya usado"}
              {last.result === "EXHAUSTED" && "Ticket agotado"}
              {last.result === "INVALID" && "Ticket invalido"}
            </div>
            <div className="mt-1 text-sm">
              {last.listingTitle && <span className="font-medium">{last.listingTitle}</span>}
              {last.holderName && <> · {last.holderName}</>}
              {typeof last.remaining === "number" && last.listingType === "PACK" && (
                <> · Quedan {last.remaining} usos</>
              )}
            </div>
            {last.message && last.result !== "OK" && (
              <div className="mt-1 text-xs opacity-80">{last.message}</div>
            )}
          </div>
        )}
      </div>

      {/* Manual + feed */}
      <div className="space-y-4">
        <form onSubmit={submitManual} className="card p-5" data-tour="scanner.manual">
          <Label htmlFor="manual">Pegar codigo manualmente</Label>
          <p className="mb-2 text-xs text-ink-500">
            Si tu navegador no tiene camara, copia el codigo desde la pantalla del ticket y pegalo aca.
          </p>
          <div className="flex gap-2">
            <Input
              id="manual"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="codigo del ticket"
              className="flex-1 font-mono"
            />
            <Button type="submit">Validar</Button>
          </div>
        </form>

        <div className="card p-5" data-tour="scanner.feed">
          <h3 className="mb-3 text-sm font-semibold text-ink-900">Escaneos recientes</h3>
          {feed.length === 0 ? (
            <p className="text-sm text-ink-500">Aun no hay escaneos. Probas con un QR.</p>
          ) : (
            <ul className="space-y-2">
              {feed.map((s) => (
                <li
                  key={s.id}
                  className={`flex items-start gap-3 rounded-xl px-3 py-2 ${RESULT_TONE[s.result] ?? "bg-ink-50 text-ink-700"}`}
                >
                  <span className="mt-0.5">{ICONS[s.result] ?? null}</span>
                  <div className="text-sm leading-tight">
                    <div className="font-medium">{s.ticket.listing.title}</div>
                    <div className="text-xs opacity-75">
                      {s.ticket.holder.name} · {new Date(s.scannedAt).toLocaleTimeString("es-AR")}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
