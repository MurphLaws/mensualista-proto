"use client";
import { motion } from "framer-motion";
import { CheckCircle2, Lock } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { formatPrice } from "@/lib/format";

type Props = {
  amountCents: number;
  title: string;
  onSuccess: (paymentRef: string) => void | Promise<void>;
  onCancel?: () => void;
};

export function FakeStripeCheckout({ amountCents, title, onSuccess, onCancel }: Props) {
  const [card, setCard] = useState("4242 4242 4242 4242");
  const [exp, setExp] = useState("12/29");
  const [cvc, setCvc] = useState("123");
  const [phase, setPhase] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [shake, setShake] = useState(0);

  async function pay() {
    const digits = card.replace(/\s/g, "");
    if (digits.length < 12 || !/^\d+$/.test(digits)) {
      setPhase("error");
      setShake((s) => s + 1);
      return;
    }
    setPhase("loading");
    await new Promise((r) => setTimeout(r, 1500));
    setPhase("success");
    const ref = "demo_" + crypto.randomUUID();
    await new Promise((r) => setTimeout(r, 600));
    await onSuccess(ref);
  }

  return (
    <motion.div
      data-tour="checkout.card"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="card overflow-hidden"
    >
      {/* Header */}
      <div className="stripe-grad px-5 py-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock size={16} />
            <span className="text-sm font-medium">Pago seguro</span>
          </div>
          <span className="text-xs uppercase tracking-wider opacity-80">
            powered by stripe-fake
          </span>
        </div>
        <div className="mt-3">
          <div className="text-xs opacity-80">Total a pagar</div>
          <div className="text-2xl font-semibold">{formatPrice(amountCents)}</div>
          <div className="text-xs opacity-80">{title}</div>
        </div>
      </div>

      {/* Form */}
      <motion.div
        key={shake}
        animate={shake > 0 ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-3 px-5 py-5"
      >
        <div>
          <Label htmlFor="card">Numero de tarjeta</Label>
          <Input
            id="card"
            value={card}
            onChange={(e) => setCard(e.target.value)}
            placeholder="4242 4242 4242 4242"
            inputMode="numeric"
            disabled={phase !== "idle" && phase !== "error"}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="exp">Vencimiento</Label>
            <Input
              id="exp"
              value={exp}
              onChange={(e) => setExp(e.target.value)}
              placeholder="MM/AA"
              disabled={phase !== "idle" && phase !== "error"}
            />
          </div>
          <div>
            <Label htmlFor="cvc">CVC</Label>
            <Input
              id="cvc"
              value={cvc}
              onChange={(e) => setCvc(e.target.value)}
              placeholder="123"
              inputMode="numeric"
              disabled={phase !== "idle" && phase !== "error"}
            />
          </div>
        </div>

        {phase === "error" && (
          <p className="text-sm text-red-600">Tarjeta invalida. Probas con 4242 4242 4242 4242.</p>
        )}

        <div className="flex items-center gap-2 pt-2">
          {onCancel && phase === "idle" && (
            <Button variant="outline" type="button" onClick={onCancel} className="flex-1">
              Cancelar
            </Button>
          )}
          <Button
            type="button"
            onClick={pay}
            disabled={phase === "loading" || phase === "success"}
            className="flex-1"
          >
            {phase === "loading" && (
              <span className="h-4 w-4 animate-spin-slow rounded-full border-2 border-white/40 border-t-white" />
            )}
            {phase === "success" && <CheckCircle2 size={18} />}
            {phase === "idle" && `Pagar ${formatPrice(amountCents)}`}
            {phase === "error" && `Reintentar pago`}
            {phase === "loading" && "Procesando..."}
            {phase === "success" && "Listo"}
          </Button>
        </div>

        <p className="pt-1 text-center text-[11px] text-ink-400">
          Esto es una demo. No se cobra ninguna tarjeta real.
        </p>
      </motion.div>
    </motion.div>
  );
}
