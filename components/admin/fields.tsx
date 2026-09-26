"use client";

import { useState } from "react";
import type { MediaItem } from "@/app/admin/actions";
import type { Field } from "@/lib/cms/schema";
import { Icon, iconNames, isIconName } from "@/components/ui/Icon";
import { MediaPreview } from "./MediaPreview";
import { MediaUploader } from "./MediaUploader";

export type Values = Record<string, unknown>;
export type MediaMap = Record<string, MediaItem>;

type FieldProps = {
  field: Field;
  values: Values;
  setValue: (column: string, value: unknown) => void;
  error?: string;
  media: MediaMap;
  rememberMedia: (item: MediaItem) => void;
  /**
   * Called after a file is uploaded, picked from the library or removed. When
   * provided (existing items), the form saves right away so the change is live.
   */
  onFileChange?: () => void;
};

const str = (v: unknown) => (typeof v === "string" ? v : v == null ? "" : String(v));
const arr = (v: unknown) => (Array.isArray(v) ? (v as string[]) : []);

function LangTag({ lang }: { lang: "ar" | "en" }) {
  return (
    <span className="rounded-md bg-[#eef3f3] px-1.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-[#4d6868]">
      {lang === "ar" ? "العربية" : "English"}
    </span>
  );
}

function Bilingual({ field, values, setValue, error }: FieldProps & { field: Extract<Field, { type: "l10n" }> }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {(["ar", "en"] as const).map((lang) => {
        const column = `${field.name}_${lang}`;
        const props = {
          id: column,
          value: str(values[column]),
          onChange: (e: { target: { value: string } }) => setValue(column, e.target.value),
          dir: lang === "ar" ? "rtl" : "ltr",
          lang,
          className: "adm-input",
          "aria-invalid": error ? true : undefined,
          "aria-label": `${field.label} (${lang === "ar" ? "Arabic" : "English"})`,
        } as const;
        return (
          <div key={lang} className="grid gap-1.5">
            <LangTag lang={lang} />
            {field.multiline ? <textarea rows={field.rows ?? 3} {...props} /> : <input type="text" {...props} />}
          </div>
        );
      })}
    </div>
  );
}

function ListEditor({ items, onChange, dir, itemLabel }: { items: string[]; onChange: (items: string[]) => void; dir: "rtl" | "ltr"; itemLabel: string }) {
  const move = (from: number, to: number) => {
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
  };
  return (
    <div className="grid gap-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <input
            value={item}
            dir={dir}
            onChange={(e) => onChange(items.map((it, j) => (j === i ? e.target.value : it)))}
            className="adm-input"
            aria-label={`${itemLabel} ${i + 1}`}
          />
          <button type="button" onClick={() => i > 0 && move(i, i - 1)} disabled={i === 0} className="adm-btn adm-btn-ghost adm-btn-icon" aria-label="Move up">
            ↑
          </button>
          <button type="button" onClick={() => i < items.length - 1 && move(i, i + 1)} disabled={i === items.length - 1} className="adm-btn adm-btn-ghost adm-btn-icon" aria-label="Move down">
            ↓
          </button>
          <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} className="adm-btn adm-btn-ghost adm-btn-icon text-red-700" aria-label={`Remove ${itemLabel}`}>
            ×
          </button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...items, ""])} className="adm-btn adm-btn-secondary justify-self-start">
        + Add {itemLabel.toLowerCase()}
      </button>
    </div>
  );
}

type Block = { type: "p" | "h2" | "quote"; text: string } | { type: "list"; items: string[] };
const blockLabels: Record<Block["type"], string> = { p: "Paragraph", h2: "Heading", list: "Bullet list", quote: "Quote" };

function BlocksEditor({ blocks, onChange, dir }: { blocks: Block[]; onChange: (b: Block[]) => void; dir: "rtl" | "ltr" }) {
  const update = (i: number, block: Block) => onChange(blocks.map((b, j) => (j === i ? block : b)));
  const move = (from: number, to: number) => {
    const next = [...blocks];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
  };
  const add = (type: Block["type"]) => onChange([...blocks, type === "list" ? { type, items: [""] } : { type, text: "" }]);

  return (
    <div className="grid gap-3">
      {blocks.length === 0 && <p className="adm-help">No content yet — add a paragraph to start.</p>}
      {blocks.map((block, i) => (
        <div key={i} className="rounded-xl border border-[#e3ebea] bg-[#fafcfc] p-3">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <select
              value={block.type}
              onChange={(e) => {
                const type = e.target.value as Block["type"];
                const current = block.type === "list" ? block.items.join("\n") : block.text;
                update(i, type === "list" ? { type, items: current.split("\n") } : { type, text: current });
              }}
              className="adm-input w-auto py-1 text-xs font-semibold"
              aria-label="Block type"
            >
              {Object.entries(blockLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <div className="ms-auto flex gap-1">
              <button type="button" onClick={() => i > 0 && move(i, i - 1)} disabled={i === 0} className="adm-btn adm-btn-ghost adm-btn-icon" aria-label="Move block up">
                ↑
              </button>
              <button type="button" onClick={() => i < blocks.length - 1 && move(i, i + 1)} disabled={i === blocks.length - 1} className="adm-btn adm-btn-ghost adm-btn-icon" aria-label="Move block down">
                ↓
              </button>
              <button type="button" onClick={() => onChange(blocks.filter((_, j) => j !== i))} className="adm-btn adm-btn-ghost adm-btn-icon text-red-700" aria-label="Delete block">
                ×
              </button>
            </div>
          </div>
          {block.type === "list" ? (
            <>
              <textarea
                rows={Math.max(3, block.items.length)}
                dir={dir}
                value={block.items.join("\n")}
                onChange={(e) => update(i, { type: "list", items: e.target.value.split("\n") })}
                className="adm-input"
                aria-label="List items"
              />
              <p className="adm-help mt-1">One item per line.</p>
            </>
          ) : (
            <textarea
              rows={block.type === "p" ? 4 : 2}
              dir={dir}
              value={block.text}
              onChange={(e) => update(i, { ...block, text: e.target.value })}
              className={`adm-input ${block.type === "h2" ? "font-bold" : block.type === "quote" ? "italic" : ""}`}
              aria-label={blockLabels[block.type]}
            />
          )}
        </div>
      ))}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(blockLabels) as Block["type"][]).map((type) => (
          <button key={type} type="button" onClick={() => add(type)} className="adm-btn adm-btn-secondary">
            + {blockLabels[type]}
          </button>
        ))}
      </div>
    </div>
  );
}

const pickerIcons = iconNames.filter((n) => !["arrow", "chevron", "close", "menu", "plus", "play", "send"].includes(n));

function IconField({ values, setValue, media, rememberMedia, onFileChange, field }: FieldProps & { field: Extract<Field, { type: "icon" }> }) {
  const current = str(values.icon);
  const uploadedId = str(values.icon_media_id);
  const uploaded = uploadedId ? media[uploadedId] : undefined;
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Built-in icons">
        {pickerIcons.map((name) => (
          <button
            key={name}
            type="button"
            role="radio"
            aria-checked={current === name && !uploaded}
            title={name}
            onClick={() => {
              setValue("icon", name);
              setValue("icon_media_id", null);
            }}
            className={`grid h-9 w-9 place-items-center rounded-lg transition ${
              current === name && !uploaded ? "bg-[#104848] text-[#8fd3d1]" : "bg-[#f1f6f6] text-[#3a5454] hover:bg-[#e3eeee]"
            }`}
          >
            <Icon name={name} size={17} />
          </button>
        ))}
      </div>
      <div>
        <p className="adm-help mb-1.5">…or upload your own (it is tinted to match the design automatically):</p>
        <MediaUploader
          kind="icon"
          folder={field.folder}
          value={uploaded ?? null}
          autoSaves={Boolean(onFileChange)}
          onChange={(m) => {
            if (m) rememberMedia(m);
            setValue("icon_media_id", m?.id ?? null);
            if (!m && !isIconName(current)) setValue("icon", "sparkle");
            onFileChange?.();
          }}
        />
      </div>
    </div>
  );
}

function GalleryField({ values, setValue, media, rememberMedia, onFileChange, field }: FieldProps & { field: Extract<Field, { type: "gallery" }> }) {
  const ids = arr(values.gallery);
  const update = (next: string[]) => {
    setValue("gallery", next);
    onFileChange?.();
  };
  return (
    <div className="grid gap-3">
      {ids.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {ids.map((id, i) => (
            <li key={id} className="rounded-xl border border-[#e3ebea] p-1.5">
              {media[id] ? <MediaPreview media={media[id]} className="aspect-square h-auto w-full" /> : <div className="aspect-square rounded-lg bg-[#eef3f3]" />}
              <div className="mt-1 flex justify-between">
                <button type="button" disabled={i === 0} onClick={() => update(ids.map((x, j) => (j === i - 1 ? id : j === i ? ids[i - 1] : x)))} className="adm-btn adm-btn-ghost adm-btn-icon" aria-label="Move earlier">
                  ←
                </button>
                <button type="button" onClick={() => update(ids.filter((x) => x !== id))} className="adm-btn adm-btn-ghost adm-btn-icon text-red-700" aria-label="Remove image">
                  ×
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <MediaUploader
        kind="image"
        folder={field.folder}
        value={null}
        uploadLabel="Upload Image"
        autoSaves={Boolean(onFileChange)}
        onChange={(m) => {
          if (!m) return;
          rememberMedia(m);
          if (!ids.includes(m.id)) update([...ids, m.id]);
        }}
      />
    </div>
  );
}

/** Renders the right input for any schema field. */
export function FieldInput(props: FieldProps) {
  const { field, values, setValue, error, media, rememberMedia, onFileChange } = props;

  const control = (() => {
    switch (field.type) {
      case "text":
      case "url":
      case "slug":
        return (
          <input
            id={field.name}
            type={field.type === "url" ? "url" : "text"}
            dir={field.type === "text" ? "auto" : "ltr"}
            value={str(values[field.name])}
            placeholder={field.placeholder}
            onChange={(e) => setValue(field.name, field.type === "slug" ? e.target.value.toLowerCase().replace(/\s+/g, "-") : e.target.value)}
            className="adm-input"
            aria-invalid={error ? true : undefined}
          />
        );
      case "textarea":
        return <textarea id={field.name} rows={field.rows ?? 4} dir="auto" value={str(values[field.name])} onChange={(e) => setValue(field.name, e.target.value)} className="adm-input" />;
      case "number":
        return (
          <input
            id={field.name}
            type="number"
            inputMode="decimal"
            step="any"
            min={field.min}
            max={field.max}
            value={str(values[field.name])}
            onChange={(e) => setValue(field.name, e.target.value)}
            className="adm-input max-w-xs"
            aria-invalid={error ? true : undefined}
          />
        );
      case "date":
        return <input id={field.name} type="date" value={str(values[field.name]).slice(0, 10)} onChange={(e) => setValue(field.name, e.target.value)} className="adm-input max-w-xs" aria-invalid={error ? true : undefined} />;
      case "select":
        return (
          <select id={field.name} value={str(values[field.name])} onChange={(e) => setValue(field.name, e.target.value)} className="adm-input max-w-sm" aria-invalid={error ? true : undefined}>
            <option value="">Choose…</option>
            {field.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        );
      case "toggle": {
        const on = values[field.name] === true;
        return (
          <button
            type="button"
            role="switch"
            aria-checked={on}
            aria-labelledby={`${field.name}-label`}
            onClick={() => setValue(field.name, !on)}
            className={`relative h-6 w-11 rounded-full transition-colors ${on ? "bg-brand" : "bg-[#cfdcdb]"}`}
          >
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? "start-[1.4rem]" : "start-0.5"}`} />
          </button>
        );
      }
      case "l10n":
        return <Bilingual {...props} field={field} />;
      case "l10nList":
        return (
          <div className="grid gap-4 md:grid-cols-2">
            {(["ar", "en"] as const).map((lang) => (
              <div key={lang} className="grid content-start gap-1.5">
                <LangTag lang={lang} />
                <ListEditor
                  items={arr(values[`${field.name}_${lang}`])}
                  onChange={(items) => setValue(`${field.name}_${lang}`, items)}
                  dir={lang === "ar" ? "rtl" : "ltr"}
                  itemLabel={field.itemLabel ?? "Item"}
                />
              </div>
            ))}
          </div>
        );
      case "blocks":
        return <BlocksTabs {...props} field={field} />;
      case "media": {
        const id = str(values[field.name]);
        return (
          <MediaUploader
            kind={field.kind}
            folder={field.folder}
            value={id ? (media[id] ?? null) : null}
            invalid={Boolean(error)}
            autoSaves={Boolean(onFileChange)}
            onChange={(m) => {
              if (m) rememberMedia(m);
              setValue(field.name, m?.id ?? null);
              // Fill in a video's duration automatically when the slot has one.
              if (m?.duration_seconds && field.kind === "video" && "duration" in values && !str(values.duration)) {
                const s = Math.round(m.duration_seconds);
                setValue("duration", `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`);
              }
              onFileChange?.();
            }}
          />
        );
      }
      case "icon":
        return <IconField {...props} field={field} />;
      case "gallery":
        return <GalleryField {...props} field={field} />;
    }
  })();

  return (
    <div className={field.type === "toggle" ? "flex items-start justify-between gap-6" : "grid gap-2"}>
      <div className="grid gap-0.5">
        <label id={`${field.name}-label`} htmlFor={["l10n", "l10nList", "blocks", "media", "icon", "gallery", "toggle"].includes(field.type) ? undefined : field.name} className="adm-label">
          {field.label}
          {field.required && <span className="text-red-600"> *</span>}
        </label>
        {field.help && <p className="adm-help">{field.help}</p>}
      </div>
      {control}
      {error && (
        <p role="alert" className="text-xs font-medium text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

function BlocksTabs({ field, values, setValue }: FieldProps & { field: Extract<Field, { type: "blocks" }> }) {
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const column = `${field.name}_${lang}`;
  return (
    <div className="rounded-xl border border-[#e3ebea] p-3">
      <div className="mb-3 flex gap-1" role="tablist" aria-label="Language">
        {(["ar", "en"] as const).map((l) => (
          <button
            key={l}
            type="button"
            role="tab"
            aria-selected={lang === l}
            onClick={() => setLang(l)}
            className={`adm-btn ${lang === l ? "adm-btn-primary" : "adm-btn-ghost"}`}
          >
            {l === "ar" ? "العربية" : "English"}
          </button>
        ))}
      </div>
      <BlocksEditor blocks={(values[column] as Block[] | undefined) ?? []} onChange={(b) => setValue(column, b)} dir={lang === "ar" ? "rtl" : "ltr"} />
    </div>
  );
}
