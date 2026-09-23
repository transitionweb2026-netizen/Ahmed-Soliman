"use client";

import { useState, type FormEvent } from "react";
import { cn } from "@/lib/cn";
import type { Dictionary } from "@/lib/dictionary";
import { Icon } from "@/components/ui/Icon";

type ContactFormProps = {
  labels: Dictionary["contactPage"];
  services: string[];
  whatsappNumber: string;
};

type Field = "name" | "phone" | "service" | "date" | "message";
type Errors = Partial<Record<Field, string>>;

const fieldClass =
  "peer w-full rounded-2xl bg-ink-950/40 px-4 pb-3 pt-6 text-[0.95rem] text-white outline-none transition-[box-shadow,background] duration-500 " +
  "shadow-[inset_0_0_0_1px_rgb(255_255_255/0.08),inset_0_2px_8px_rgb(0_0_0/0.35)] placeholder:text-transparent " +
  "hover:shadow-[inset_0_0_0_1px_rgb(72_164_164/0.35),inset_0_2px_8px_rgb(0_0_0/0.35)] " +
  "focus:bg-ink-950/60 focus:shadow-[inset_0_0_0_1px_rgb(72_164_164/0.9),0_0_0_4px_rgb(72_164_164/0.15)] " +
  "aria-[invalid=true]:shadow-[inset_0_0_0_1px_rgb(248_113_113/0.8)]";

const labelClass =
  "pointer-events-none absolute start-4 top-2 text-[0.7rem] font-medium text-brand-light/90 transition-all duration-300";

/**
 * Booking form. There is no backend yet, so a valid submission opens WhatsApp
 * with the request pre-filled — the clinic receives it immediately.
 */
export function ContactForm({ labels, services, whatsappNumber }: ContactFormProps) {
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const value = (key: Field) => String(data.get(key) ?? "").trim();

    const next: Errors = {};
    if (!value("name")) next.name = labels.required;
    if (!value("phone")) next.phone = labels.required;
    else if (!/^[+\d\s()-]{7,}$/.test(value("phone"))) next.phone = labels.invalidPhone;
    setErrors(next);
    if (Object.keys(next).length) {
      const first = Object.keys(next)[0];
      event.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    const lines = [
      `${labels.name}: ${value("name")}`,
      `${labels.phoneField}: ${value("phone")}`,
      value("service") && `${labels.service}: ${value("service")}`,
      value("date") && `${labels.date}: ${value("date")}`,
      value("message") && `${labels.message}: ${value("message")}`,
    ].filter(Boolean);

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener");
    setSent(true);
  }

  const errorId = (field: Field) => (errors[field] ? `${field}-error` : undefined);

  return (
    <form noValidate onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <div className="relative">
        <input
          id="name"
          name="name"
          autoComplete="name"
          placeholder={labels.name}
          aria-invalid={!!errors.name}
          aria-describedby={errorId("name")}
          className={fieldClass}
        />
        <label htmlFor="name" className={labelClass}>
          {labels.name} *
        </label>
        {errors.name && (
          <p id="name-error" className="mt-1.5 text-xs text-red-300">
            {errors.name}
          </p>
        )}
      </div>

      <div className="relative">
        <input
          id="phone"
          name="phone"
          type="tel"
          dir="ltr"
          autoComplete="tel"
          placeholder={labels.phoneField}
          aria-invalid={!!errors.phone}
          aria-describedby={errorId("phone")}
          className={cn(fieldClass, "rtl:text-right")}
        />
        <label htmlFor="phone" className={labelClass}>
          {labels.phoneField} *
        </label>
        {errors.phone && (
          <p id="phone-error" className="mt-1.5 text-xs text-red-300">
            {errors.phone}
          </p>
        )}
      </div>

      <div className="relative">
        <select id="service" name="service" defaultValue="" className={cn(fieldClass, "appearance-none pe-10")}>
          <option value="" className="bg-ink-900">
            {labels.servicePlaceholder}
          </option>
          {services.map((service) => (
            <option key={service} value={service} className="bg-ink-900">
              {service}
            </option>
          ))}
        </select>
        <label htmlFor="service" className={labelClass}>
          {labels.service}
        </label>
        <Icon name="chevron" size={16} className="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 rotate-90 text-brand-light" />
      </div>

      <div className="relative">
        <input id="date" name="date" type="date" className={cn(fieldClass, "[color-scheme:dark]")} />
        <label htmlFor="date" className={labelClass}>
          {labels.date}
        </label>
      </div>

      <div className="relative sm:col-span-2">
        <textarea id="message" name="message" rows={5} placeholder={labels.message} className={cn(fieldClass, "resize-none")} />
        <label htmlFor="message" className={labelClass}>
          {labels.message}
        </label>
      </div>

      <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center">
        <button type="submit" className="btn btn-primary btn-lg w-full sm:w-auto">
          <Icon name="whatsapp" size={19} />
          {labels.submit}
        </button>
        <p role="status" className={cn("text-sm text-brand-light transition-opacity", sent ? "opacity-100" : "opacity-0")}>
          {sent && labels.sent}
        </p>
      </div>
    </form>
  );
}
