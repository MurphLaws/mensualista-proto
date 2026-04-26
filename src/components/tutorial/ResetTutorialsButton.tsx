"use client";
import { RotateCcw } from "lucide-react";
import { useState } from "react";
import { useTutorial } from "./TutorialProvider";

export function ResetTutorialsButton() {
  const { resetAll } = useTutorial();
  const [done, setDone] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        resetAll();
        setDone(true);
        setTimeout(() => setDone(false), 1800);
      }}
      className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-white px-3 py-1.5 text-xs font-medium text-ink-700 hover:border-brand-300 hover:text-brand-700"
    >
      <RotateCcw size={14} />
      {done ? "Reiniciados" : "Volver a ver tutoriales"}
    </button>
  );
}
