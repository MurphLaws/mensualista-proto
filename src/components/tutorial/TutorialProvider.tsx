"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import { findTourForPath, TOURS, type Tour } from "@/tutorials/tours";
import { TutorialOverlay } from "./TutorialOverlay";

type Ctx = {
  activeTour: Tour | null;
  stepIndex: number;
  start: (tourId?: string) => void;
  stop: () => void;
  next: () => void;
  prev: () => void;
  isOpen: boolean;
  hasTourForPath: boolean;
  resetAll: () => void;
};

const TutorialCtx = createContext<Ctx | null>(null);

const FLAG_PREFIX = "mensualista.tutorial.";

function flagKey(tourId: string) {
  return FLAG_PREFIX + tourId + ".done";
}

export function useTutorial() {
  const v = useContext(TutorialCtx);
  if (!v) throw new Error("useTutorial fuera de TutorialProvider");
  return v;
}

export function TutorialProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/";
  const [activeTour, setActiveTour] = useState<Tour | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const lastAutoTour = useRef<string | null>(null);

  const tourForPath = useMemo(() => findTourForPath(pathname) ?? null, [pathname]);

  // Auto-launch on first visit per tour id
  useEffect(() => {
    if (!tourForPath) return;
    if (typeof window === "undefined") return;
    if (lastAutoTour.current === tourForPath.id) return;
    lastAutoTour.current = tourForPath.id;
    const seen = window.localStorage.getItem(flagKey(tourForPath.id));
    if (seen) return;
    // Tiny delay to ensure page mounted and data-tour targets exist
    const t = setTimeout(() => {
      // Mark as seen on first auto-show so abandoning by navigation
      // does not re-trigger the tour next time.
      window.localStorage.setItem(flagKey(tourForPath.id), "1");
      setActiveTour(tourForPath);
      setStepIndex(0);
    }, 350);
    return () => clearTimeout(t);
  }, [tourForPath]);

  // If user navigates while a tour is open, close it
  useEffect(() => {
    if (activeTour && tourForPath?.id !== activeTour.id) {
      setActiveTour(null);
      setStepIndex(0);
    }
  }, [pathname, activeTour, tourForPath]);

  const start = useCallback(
    (tourId?: string) => {
      const tour = tourId ? TOURS.find((t) => t.id === tourId) : tourForPath;
      if (!tour) return;
      setActiveTour(tour);
      setStepIndex(0);
    },
    [tourForPath],
  );

  const stop = useCallback(() => {
    if (activeTour && typeof window !== "undefined") {
      window.localStorage.setItem(flagKey(activeTour.id), "1");
    }
    setActiveTour(null);
    setStepIndex(0);
  }, [activeTour]);

  const next = useCallback(() => {
    if (!activeTour) return;
    if (stepIndex < activeTour.steps.length - 1) setStepIndex((i) => i + 1);
    else stop();
  }, [activeTour, stepIndex, stop]);

  const prev = useCallback(() => {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  }, [stepIndex]);

  const resetAll = useCallback(() => {
    if (typeof window === "undefined") return;
    const keys: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k && k.startsWith(FLAG_PREFIX)) keys.push(k);
    }
    keys.forEach((k) => window.localStorage.removeItem(k));
    lastAutoTour.current = null;
    // Trigger the tour for the current path right away if there is one
    if (tourForPath) {
      setActiveTour(tourForPath);
      setStepIndex(0);
      window.localStorage.setItem(flagKey(tourForPath.id), "1");
    }
  }, [tourForPath]);

  const value: Ctx = {
    activeTour,
    stepIndex,
    start,
    stop,
    next,
    prev,
    isOpen: !!activeTour,
    hasTourForPath: !!tourForPath,
    resetAll,
  };

  return (
    <TutorialCtx.Provider value={value}>
      {children}
      <TutorialOverlay />
    </TutorialCtx.Provider>
  );
}
