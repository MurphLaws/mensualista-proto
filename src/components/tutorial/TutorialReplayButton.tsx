"use client";
import { HelpCircle } from "lucide-react";
import { useTutorial } from "./TutorialProvider";

export function TutorialReplayButton() {
  const { hasTourForPath, start, isOpen } = useTutorial();
  if (!hasTourForPath || isOpen) return null;
  return (
    <button
      type="button"
      onClick={() => start()}
      className="hidden items-center gap-1.5 rounded-full border border-ink-200 bg-white px-3 py-1.5 text-xs font-medium text-ink-700 hover:border-brand-300 hover:text-brand-700 sm:inline-flex"
      title="Volver a ver el tutorial de esta pantalla"
    >
      <HelpCircle size={14} />
      Tutorial
    </button>
  );
}
