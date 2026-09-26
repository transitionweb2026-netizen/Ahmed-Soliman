"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { saveCollectionItem, saveRecord, type MediaItem, type RecordTarget } from "@/app/admin/actions";
import type { Field } from "@/lib/cms/schema";
import { FieldInput, type MediaMap, type Values } from "./fields";
import { useToast } from "./Toast";

type Target = { type: "collection"; key: string; id: string | null } | { type: "record"; record: RecordTarget };

type RecordFormProps = {
  target: Target;
  fields: Field[];
  initialValues: Values;
  initialMedia: MediaMap;
  /** Collections: "is_active" switch or "status" (draft / published). */
  statusField?: "is_active" | "status";
  submitLabel?: string;
  /** Render without the outer card (e.g. inside a page-section panel). */
  bare?: boolean;
};

/**
 * Schema-driven editor used by every CMS screen. Tracks unsaved changes,
 * warns before leaving, and reports save success / errors.
 */
export function RecordForm({ target, fields, initialValues, initialMedia, statusField, submitLabel = "Save changes", bare = false }: RecordFormProps) {
  const router = useRouter();
  const toast = useToast();
  const [values, setValues] = useState<Values>(initialValues);
  const [saved, setSaved] = useState<Values>(initialValues);
  const [media, setMedia] = useState<MediaMap>(initialMedia);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, startTransition] = useTransition();

  const dirty = useMemo(() => JSON.stringify(values) !== JSON.stringify(saved), [values, saved]);
  const isNew = target.type === "collection" && !target.id;

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const setValue = (column: string, value: unknown) => {
    setValues((v) => ({ ...v, [column]: value }));
    const field = fields.find((f) => f.name === column || column.startsWith(`${f.name}_`));
    if (field && errors[field.name]) setErrors(({ [field.name]: _removed, ...rest }) => rest);
  };
  const rememberMedia = (item: MediaItem) => setMedia((m) => ({ ...m, [item.id]: item }));

  function save() {
    startTransition(async () => {
      const result =
        target.type === "collection"
          ? await saveCollectionItem(target.key, target.id, values)
          : await saveRecord(target.record, values);

      if (!result.ok) {
        setErrors(result.fieldErrors ?? {});
        toast("error", result.error);
        return;
      }
      setErrors({});
      setSaved(values);
      toast("success", isNew ? "Created — it's live on the website." : "Saved — the website is updated.");
      if (isNew && target.type === "collection") {
        const id = (result.data as { id: string } | undefined)?.id;
        if (id) router.replace(`/admin/${target.key}/${id}`);
      } else {
        router.refresh();
      }
    });
  }

  const status =
    statusField === "status" ? (
      <label className="flex items-center gap-2 text-sm">
        <span className="adm-label">Status</span>
        <select value={String(values.status ?? "draft")} onChange={(e) => setValue("status", e.target.value)} className="adm-input w-auto py-1.5">
          <option value="published">Published</option>
          <option value="draft">Draft (hidden)</option>
        </select>
      </label>
    ) : statusField === "is_active" ? (
      <button
        type="button"
        role="switch"
        aria-checked={values.is_active !== false}
        onClick={() => setValue("is_active", values.is_active === false)}
        className="flex items-center gap-2 text-sm font-semibold"
      >
        <span className={`relative h-6 w-11 rounded-full transition-colors ${values.is_active !== false ? "bg-brand" : "bg-[#cfdcdb]"}`}>
          <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${values.is_active !== false ? "start-[1.4rem]" : "start-0.5"}`} />
        </span>
        {values.is_active !== false ? "Active (visible)" : "Inactive (hidden)"}
      </button>
    ) : null;

  const body = (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
      className="grid gap-6"
      noValidate
    >
      {status && <div className="flex flex-wrap items-center gap-4 rounded-xl bg-[#f5f9f9] px-4 py-3">{status}</div>}
      {fields.map((field) => (
        <FieldInput
          key={field.name}
          field={field}
          values={values}
          setValue={setValue}
          error={errors[field.name]}
          media={media}
          rememberMedia={rememberMedia}
        />
      ))}
      <div className="sticky bottom-0 -mx-1 flex flex-wrap items-center gap-3 border-t border-[#e3ebea] bg-white/95 px-1 py-3 backdrop-blur">
        <button type="submit" disabled={pending || (!dirty && !isNew)} className="adm-btn adm-btn-primary">
          {pending ? "Saving…" : isNew ? "Create" : submitLabel}
        </button>
        {dirty && !pending && (
          <>
            <span className="adm-badge bg-amber-100 text-amber-800">Unsaved changes</span>
            <button type="button" onClick={() => { setValues(saved); setErrors({}); }} className="adm-btn adm-btn-ghost">
              Discard
            </button>
          </>
        )}
        {!dirty && !pending && !isNew && <span className="text-xs text-[#6b8080]">All changes saved</span>}
      </div>
    </form>
  );

  return bare ? body : <div className="adm-card p-5 sm:p-6">{body}</div>;
}
