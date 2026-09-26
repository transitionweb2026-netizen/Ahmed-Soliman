"use client";

import { useEffect, useRef, type ReactNode } from "react";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "lg";
};

/** Native <dialog> modal: focus trap, Escape and backdrop click to close. */
export function Dialog({ open, onClose, title, children, footer, size = "sm" }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (open && dialog && !dialog.open) dialog.showModal();
    if (!open && dialog?.open) dialog.close();
  }, [open]);

  if (!open) return null;
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className={`m-auto w-[calc(100%-1.5rem)] rounded-2xl bg-white p-0 text-[#0f2424] shadow-2xl backdrop:bg-black/40 ${size === "lg" ? "max-w-4xl" : "max-w-md"}`}
    >
      <div className="flex max-h-[85dvh] flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-[#e3ebea] px-5 py-4">
          <h2 className="text-base font-bold">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="adm-btn adm-btn-ghost adm-btn-icon text-lg">
            ×
          </button>
        </header>
        <div className="overflow-y-auto px-5 py-4">{children}</div>
        {footer && <footer className="flex flex-wrap justify-end gap-2 border-t border-[#e3ebea] px-5 py-3">{footer}</footer>}
      </div>
    </dialog>
  );
}
