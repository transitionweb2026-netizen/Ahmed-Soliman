"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

type Toast = { id: number; kind: "success" | "error" | "info"; message: string };
type ToastApi = (kind: Toast["kind"], message: string) => void;

const ToastContext = createContext<ToastApi>(() => {});

export function useToast() {
  return useContext(ToastContext);
}

/** Small stacked notifications for save / delete / upload results. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback<ToastApi>((kind, message) => {
    const id = Date.now() + Math.random();
    setToasts((list) => [...list, { id, kind, message }]);
    setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), kind === "error" ? 7000 : 3500);
  }, []);

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-3 bottom-3 z-[100] flex flex-col items-center gap-2 sm:inset-x-auto sm:end-5 sm:bottom-5 sm:items-end">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role={toast.kind === "error" ? "alert" : "status"}
            className={`pointer-events-auto flex max-w-sm animate-[adm-slide-in_0.25s_ease-out] items-start gap-2.5 rounded-xl px-4 py-3 text-sm font-medium shadow-lg ${
              toast.kind === "error"
                ? "bg-red-600 text-white"
                : toast.kind === "success"
                  ? "bg-[#104848] text-white"
                  : "bg-white text-[#0f2424] ring-1 ring-black/10"
            }`}
          >
            <span aria-hidden="true">{toast.kind === "error" ? "✕" : toast.kind === "success" ? "✓" : "•"}</span>
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
