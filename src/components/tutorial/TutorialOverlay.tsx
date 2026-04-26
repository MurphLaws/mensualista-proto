"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useTutorial } from "./TutorialProvider";
import type { Placement, TourStep } from "@/tutorials/tours";

type Rect = { x: number; y: number; width: number; height: number };

const TOOLTIP_W = 320;
const TOOLTIP_H = 168;
const PAD = 10;
const GAP = 12;

function findTarget(name?: string): Element | null {
  if (!name) return null;
  return document.querySelector(`[data-tour="${name}"]`);
}

function getRect(el: Element): Rect {
  const r = el.getBoundingClientRect();
  return { x: r.left, y: r.top, width: r.width, height: r.height };
}

function viewportRect(): Rect {
  const w = typeof window === "undefined" ? 1024 : window.innerWidth;
  const h = typeof window === "undefined" ? 768 : window.innerHeight;
  return { x: w / 2 - 1, y: h / 2 - 1, width: 2, height: 2 };
}

function placeTooltip(rect: Rect, placement: Placement = "auto") {
  const w = typeof window === "undefined" ? 1024 : window.innerWidth;
  const h = typeof window === "undefined" ? 768 : window.innerHeight;
  const margin = 12;

  if (placement === "center") {
    return { left: w / 2 - TOOLTIP_W / 2, top: h / 2 - TOOLTIP_H / 2, arrow: "none" as const };
  }

  // Try requested placement, fall back to opposite if no room
  const tries: Placement[] =
    placement === "auto"
      ? ["bottom", "top", "right", "left"]
      : [placement, oppositeOf(placement), "bottom", "top", "right", "left"];

  for (const p of tries) {
    const pos = computePos(rect, p);
    if (pos.left >= margin && pos.top >= margin && pos.left + TOOLTIP_W <= w - margin && pos.top + TOOLTIP_H <= h - margin) {
      return { ...pos, arrow: p };
    }
  }
  // Last resort: clamp center
  return {
    left: Math.max(margin, Math.min(w - TOOLTIP_W - margin, rect.x)),
    top: Math.max(margin, Math.min(h - TOOLTIP_H - margin, rect.y + rect.height + GAP)),
    arrow: "bottom" as const,
  };
}

function computePos(rect: Rect, p: Placement) {
  const cx = rect.x + rect.width / 2;
  const cy = rect.y + rect.height / 2;
  switch (p) {
    case "top":
      return { left: cx - TOOLTIP_W / 2, top: rect.y - TOOLTIP_H - GAP };
    case "bottom":
      return { left: cx - TOOLTIP_W / 2, top: rect.y + rect.height + GAP };
    case "left":
      return { left: rect.x - TOOLTIP_W - GAP, top: cy - TOOLTIP_H / 2 };
    case "right":
      return { left: rect.x + rect.width + GAP, top: cy - TOOLTIP_H / 2 };
    default:
      return { left: rect.x, top: rect.y + rect.height + GAP };
  }
}

function oppositeOf(p: Placement): Placement {
  return p === "top" ? "bottom" : p === "bottom" ? "top" : p === "left" ? "right" : p === "right" ? "left" : "auto";
}

export function TutorialOverlay() {
  const { activeTour, stepIndex, next, prev, stop, isOpen } = useTutorial();
  const step: TourStep | undefined = activeTour?.steps[stepIndex];

  const [rect, setRect] = useState<Rect | null>(null);
  const [placement, setPlacement] = useState<Placement>("center");
  const [tip, setTip] = useState<{ left: number; top: number; arrow: Placement | "none" } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Re-measure on step change, scroll, resize
  useLayoutEffect(() => {
    if (!step) {
      setRect(null);
      setTip(null);
      return;
    }
    function measure() {
      if (!step) return;
      const isCenter = step.placement === "center" || !step.target;
      const target = findTarget(step.target);
      const r = isCenter || !target ? viewportRect() : getRect(target);
      // Scroll target into view if off-screen
      if (target && !isCenter) {
        const vh = window.innerHeight;
        if (r.y < 50 || r.y + r.height > vh - 50) {
          target.scrollIntoView({ block: "center", behavior: "smooth" });
        }
      }
      setRect(r);
      const p = isCenter ? "center" : (step.placement ?? "auto");
      setPlacement(p);
      setTip(placeTooltip(r, p));
    }
    measure();
    const onScroll = () => measure();
    const onResize = () => measure();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);
    // Re-measure after layout shifts (e.g., images loading)
    const t = setTimeout(measure, 80);
    const t2 = setTimeout(measure, 240);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, [step]);

  // Keyboard nav
  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === "Enter") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      } else if (e.key === "Escape") {
        e.preventDefault();
        stop();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, next, prev, stop]);

  if (!mounted || !isOpen || !activeTour || !step || !rect || !tip) return null;

  const isCenter = placement === "center";
  const total = activeTour.steps.length;
  const isLast = stepIndex === total - 1;

  // Dimensions for the spotlight cutout (rect with padding)
  const cut = isCenter
    ? { x: rect.x, y: rect.y, w: 2, h: 2, r: 1 }
    : { x: rect.x - PAD, y: rect.y - PAD, w: rect.width + PAD * 2, h: rect.height + PAD * 2, r: 14 };

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[70]">
      {/* Spotlight SVG */}
      <svg className="absolute inset-0 h-full w-full pointer-events-auto" onClick={() => {}}>
        <defs>
          <mask id="tutorial-cutout">
            <rect width="100%" height="100%" fill="white" />
            <motion.rect
              fill="black"
              initial={false}
              animate={{ x: cut.x, y: cut.y, width: cut.w, height: cut.h, rx: cut.r, ry: cut.r }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
            />
          </mask>
        </defs>
        <motion.rect
          width="100%"
          height="100%"
          fill="rgba(14, 16, 32, 0.62)"
          mask="url(#tutorial-cutout)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={stop}
        />
        {/* Soft glow ring around the cutout */}
        {!isCenter && (
          <motion.rect
            initial={false}
            animate={{ x: cut.x, y: cut.y, width: cut.w, height: cut.h, rx: cut.r, ry: cut.r }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            fill="none"
            stroke="rgba(109,91,255,0.85)"
            strokeWidth={2}
          />
        )}
      </svg>

      {/* Tooltip */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={`${activeTour.id}-${stepIndex}`}
          className="pointer-events-auto absolute"
          style={{ left: tip.left, top: tip.top, width: TOOLTIP_W }}
          initial={{ opacity: 0, scale: 0.96, y: 6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: -4 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
        >
          <div className="relative rounded-2xl bg-white p-4 shadow-soft ring-1 ring-ink-200">
            {/* Arrow */}
            {tip.arrow !== "none" && tip.arrow !== "center" && (
              <span
                aria-hidden
                className="absolute h-3 w-3 rotate-45 bg-white ring-1 ring-ink-200"
                style={arrowStyle(tip.arrow)}
              />
            )}

            <div className="mb-1 flex items-center justify-between">
              <span className="pill !bg-brand-100 !text-brand-700">
                Paso {stepIndex + 1} de {total}
              </span>
              <button
                type="button"
                onClick={stop}
                className="-mr-1 rounded-lg p-1 text-ink-500 hover:bg-ink-100"
                aria-label="Cerrar tutorial"
              >
                <X size={16} />
              </button>
            </div>
            <h3 className="text-base font-semibold text-ink-900">{step.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-ink-500">{step.body}</p>

            <div className="mt-3 flex items-center justify-between">
              <button
                type="button"
                onClick={stop}
                className="text-xs font-medium text-ink-500 hover:text-ink-700"
              >
                Saltar tour
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={prev}
                  disabled={stepIndex === 0}
                  className="btn-ghost h-9 w-9 !p-0 disabled:opacity-40"
                  aria-label="Paso anterior"
                >
                  <ArrowLeft size={16} />
                </button>
                <button type="button" onClick={next} className="btn-primary h-9 px-4 text-sm">
                  {isLast ? "Listo" : "Siguiente"}
                  {!isLast && <ArrowRight size={16} />}
                </button>
              </div>
            </div>

            {/* Progress dots */}
            <div className="mt-3 flex items-center gap-1">
              {activeTour.steps.map((_, i) => (
                <span
                  key={i}
                  className={
                    "h-1 flex-1 rounded-full transition-colors " +
                    (i <= stepIndex ? "bg-brand-500" : "bg-ink-200")
                  }
                />
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>,
    document.body,
  );
}

function arrowStyle(p: Placement | "none"): React.CSSProperties {
  switch (p) {
    case "top":
      return { left: "calc(50% - 6px)", bottom: -6 };
    case "bottom":
      return { left: "calc(50% - 6px)", top: -6 };
    case "left":
      return { right: -6, top: "calc(50% - 6px)" };
    case "right":
      return { left: -6, top: "calc(50% - 6px)" };
    default:
      return { display: "none" };
  }
}
