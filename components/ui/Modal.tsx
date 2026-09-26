"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  closeLabel: string;
  children: ReactNode;
  /** Optional media rendered above the scrolling body, edge to edge. */
  media?: ReactNode;
  size?: "md" | "lg";
};

/**
 * Liquid Glass modal on top of the native <dialog>: the browser handles focus
 * trapping, Escape and an inert page behind it. Long content scrolls inside.
 */
export function Modal({ open, onClose, title, closeLabel, children, media, size = "md" }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!open || !dialog) return;
    if (!dialog.open) dialog.showModal();
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [open]);

  if (!open) return null;

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => event.target === ref.current && ref.current?.close()}
      className={cn(
        "m-auto max-h-none w-full max-w-none bg-transparent p-3 text-mist backdrop:bg-ink-950/75 backdrop:backdrop-blur-lg sm:p-6",
        size === "lg" ? "sm:max-w-4xl" : "sm:max-w-3xl",
      )}
    >
      <div className="glass glass-strong relative flex max-h-[calc(100dvh-1.5rem)] animate-[dialog-in_0.5s_var(--ease-lux)_both] flex-col overflow-hidden rounded-[2rem] sm:max-h-[calc(100dvh-3rem)]">
        <div aria-hidden="true" className="absolute -end-24 -top-24 -z-10 h-64 w-64 rounded-full bg-brand/25 blur-3xl" />

        <button
          type="button"
          onClick={() => ref.current?.close()}
          aria-label={closeLabel}
          className="btn btn-glass absolute end-4 top-4 z-20 h-11 min-h-0 w-11 rounded-full p-0"
        >
          <Icon name="close" size={20} />
        </button>

        <div className="overflow-y-auto overscroll-contain">
          {media && <div className="relative p-2.5 pb-0">{media}</div>}
          <div className="p-6 sm:p-10">
            <h2 id={titleId} className="text-gradient pe-12 text-3xl leading-tight sm:text-4xl">
              {title}
            </h2>
            <div className="mt-6">{children}</div>
          </div>
        </div>
      </div>
    </dialog>
  );
}
