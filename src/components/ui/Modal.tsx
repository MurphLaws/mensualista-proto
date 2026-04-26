"use client";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";

export function Modal({
  open,
  onClose,
  title,
  children,
  className,
  closeOnBackdrop = true,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  closeOnBackdrop?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <div
            className="absolute inset-0 bg-ink-900/40 backdrop-blur-[2px]"
            onClick={() => closeOnBackdrop && onClose()}
          />
          <motion.div
            className={cn(
              "relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-soft",
              className,
            )}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
          >
            {title && (
              <div className="flex items-center justify-between px-5 pt-5">
                <h3 className="text-base font-semibold text-ink-900">{title}</h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="-mr-1 rounded-lg p-1 text-ink-500 hover:bg-ink-100"
                  aria-label="Cerrar"
                >
                  <X size={18} />
                </button>
              </div>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
