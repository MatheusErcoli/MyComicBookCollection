"use client";

import { useState } from "react";
import { getApiErrorMessage } from "@/src/services/api";

export interface EntityField {
  key: string;
  label: string;
  type: "text" | "number" | "textarea";
  placeholder?: string;
  required?: boolean;
  colSpan?: 1 | 2;
}

type EntityItem = {
  id: number;
};

interface SimpleEntityManagerProps<T extends EntityItem> {
  title: string;
  fields: EntityField[];
  items: T[];
  onCreate: (payload: Record<string, unknown>) => Promise<void>;
  onUpdate: (id: number, payload: Record<string, unknown>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  renderItemTitle: (item: T) => string;
  renderItemSubtitle?: (item: T) => string | null;
}

function buildEmptyForm(fields: EntityField[]) {
  const form: Record<string, string> = {};

  fields.forEach((field) => {
    form[field.key] = "";
  });

  return form;
}

export default function SimpleEntityManager<T extends EntityItem>({
  title,
  fields,
  items,
  onCreate,
  onUpdate,
  onDelete,
  renderItemTitle,
  renderItemSubtitle,
}: SimpleEntityManagerProps<T>) {
  const [form, setForm] = useState<Record<string, string>>(() =>
    buildEmptyForm(fields)
  );
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleChange(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function startEdit(item: T) {
    const nextForm: Record<string, string> = {};
    const record = item as unknown as Record<string, unknown>;

    fields.forEach((field) => {
      const value = record[field.key];
      nextForm[field.key] = value === null || value === undefined ? "" : String(value);
    });

    setForm(nextForm);
    setEditingId(item.id);
  }

  function cancelEdit() {
    setForm(buildEmptyForm(fields));
    setEditingId(null);
  }

  function buildPayload() {
    const payload: Record<string, unknown> = {};

    fields.forEach((field) => {
      const raw = form[field.key];

      if (raw === "" || raw === undefined) {
        return;
      }

      payload[field.key] = field.type === "number" ? Number(raw) : raw;
    });

    return payload;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const requiredMissing = fields.some(
      (field) => field.required && !form[field.key]
    );

    if (requiredMissing) {
      setError("Preencha os campos obrigatórios.");
      return;
    }

    try {
      setSaving(true);

      const payload = buildPayload();

      if (editingId) {
        await onUpdate(editingId, payload);
      } else {
        await onCreate(payload);
      }

      cancelEdit();
    } catch (err) {
      setError(getApiErrorMessage(err, "Erro ao salvar."));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    setError("");

    try {
      await onDelete(id);

      if (editingId === id) {
        cancelEdit();
      }
    } catch (err) {
      setError(getApiErrorMessage(err, "Erro ao excluir."));
    }
  }

  return (
    <div className="rounded-xl border border-[#28374e] bg-[#1d2a3d] p-6">
      <h2 className="text-xl font-bold text-white">{title}</h2>

      {error ? (
        <div className="mt-4 rounded-lg border border-red-900/60 bg-red-950/30 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        {fields.map((field) => (
          <div
            key={field.key}
            className={field.colSpan === 2 ? "md:col-span-2" : ""}
          >
            <label className="mb-2 block text-sm text-white">
              {field.label}
              {field.required ? " *" : ""}
            </label>

            {field.type === "textarea" ? (
              <textarea
                value={form[field.key] ?? ""}
                onChange={(e) => handleChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                rows={3}
                className="w-full rounded-lg border border-[#334155] bg-[#0f1726] px-4 py-3 text-white placeholder:text-slate-500 focus:border-red-500 focus:outline-none"
              />
            ) : (
              <input
                type={field.type}
                value={form[field.key] ?? ""}
                onChange={(e) => handleChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="w-full rounded-lg border border-[#334155] bg-[#0f1726] px-4 py-3 text-white placeholder:text-slate-500 focus:border-red-500 focus:outline-none"
              />
            )}
          </div>
        ))}

        <div className="flex gap-3 md:col-span-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-red-500 px-5 py-3 font-semibold text-white transition hover:bg-red-600 disabled:opacity-60"
          >
            {editingId ? "Salvar alterações" : `+ Cadastrar`}
          </button>

          {editingId ? (
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-xl border border-[#334155] px-5 py-3 font-semibold text-white transition hover:bg-[#0f1726]"
            >
              Cancelar
            </button>
          ) : null}
        </div>
      </form>

      <div className="mt-6 space-y-2">
        {items.length === 0 ? (
          <p className="text-sm text-[#7c95b8]">Nenhum registro cadastrado ainda.</p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-lg border border-[#28374e] bg-[#0f1726] px-4 py-3"
            >
              <div>
                <p className="font-medium text-white">{renderItemTitle(item)}</p>
                {renderItemSubtitle ? (
                  <p className="text-sm text-[#7c95b8]">{renderItemSubtitle(item)}</p>
                ) : null}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => startEdit(item)}
                  className="rounded-lg border border-[#334155] px-3 py-1.5 text-sm text-white transition hover:bg-[#1d2a3d]"
                >
                  Editar
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="rounded-lg border border-red-900/60 px-3 py-1.5 text-sm text-red-300 transition hover:bg-red-950/30"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
