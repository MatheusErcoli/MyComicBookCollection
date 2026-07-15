"use client";

import { useState, type Dispatch, type SetStateAction } from "react";
import { getApiErrorMessage } from "../../services/api";
import {
  atualizarHQ,
  buscarHQ,
  criarHQ,
  deletarHQ,
  listarRelacoesHqVolume,
  sincronizarAutoresDaHQ,
  sincronizarColecaoDaHQ,
  sincronizarDesenhistasDaHQ,
  sincronizarVolumesDaHQ,
} from "../../services/admin.service";
import {
  Autor,
  Colecao,
  Desenhista,
  Editora,
  HQ,
  Volume,
} from "../../types/admin.types";
import CheckboxSelectList from "./CheckboxSelectLista";

interface HQManagerProps {
  hqs: HQ[];
  editoras: Editora[];
  autores: Autor[];
  desenhistas: Desenhista[];
  colecoes: Colecao[];
  volumes: Volume[];
  onChanged: () => Promise<void>;
}

const emptyForm = {
  titulo: "",
  capa_url: "",
  descricao: "",
  editora_id: "",
  numero_edicao: "",
  formato: "",
  quantidade_paginas: "",
  data_publicacao: "",
  valor: "",
  valor_pago: "",
  colecao_id: "",
  ordem_colecao: "",
};

type FormState = typeof emptyForm;

export default function HQManager({
  hqs,
  editoras,
  autores,
  desenhistas,
  colecoes,
  volumes,
  onChanged,
}: HQManagerProps) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [autorIds, setAutorIds] = useState<number[]>([]);
  const [desenhistaIds, setDesenhistaIds] = useState<number[]>([]);
  const [volumeIds, setVolumeIds] = useState<number[]>([]);
  const [qtdVolumesRecentes, setQtdVolumesRecentes] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [error, setError] = useState("");

  function handleChange(key: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggle(
    list: number[],
    setList: Dispatch<SetStateAction<number[]>>,
    id: number
  ) {
    if (list.includes(id)) {
      setList(list.filter((current) => current !== id));
    } else {
      setList([...list, id]);
    }
  }

  function resetForm() {
    setForm(emptyForm);
    setAutorIds([]);
    setDesenhistaIds([]);
    setVolumeIds([]);
    setQtdVolumesRecentes("");
    setEditingId(null);
  }

  function handleSelecionarUltimosVolumes() {
    const quantidade = Number(qtdVolumesRecentes);

    if (!quantidade || quantidade <= 0) {
      return;
    }

    // Assume que ids maiores = volumes cadastrados mais recentemente
    const ultimosVolumes = [...volumes]
      .sort((a, b) => b.id - a.id)
      .slice(0, quantidade)
      .map((volume) => volume.id);

    setVolumeIds(ultimosVolumes);
  }

  async function startEdit(hq: HQ) {
    setError("");
    setLoadingEdit(true);

    try {
      const hqCompleta = await buscarHQ(hq.id);
      const relacoesVolume = await listarRelacoesHqVolume(hq.id);

      setForm({
        titulo: hqCompleta.titulo ?? "",
        capa_url: hqCompleta.capa_url ?? "",
        descricao: hqCompleta.descricao ?? "",
        editora_id: hqCompleta.editora_id ? String(hqCompleta.editora_id) : "",
        numero_edicao:
          hqCompleta.numero_edicao !== null && hqCompleta.numero_edicao !== undefined
            ? String(hqCompleta.numero_edicao)
            : "",
        formato: hqCompleta.formato ?? "",
        quantidade_paginas:
          hqCompleta.quantidade_paginas !== null &&
          hqCompleta.quantidade_paginas !== undefined
            ? String(hqCompleta.quantidade_paginas)
            : "",
        data_publicacao: hqCompleta.data_publicacao
          ? hqCompleta.data_publicacao.slice(0, 10)
          : "",
        valor:
          hqCompleta.valor !== null && hqCompleta.valor !== undefined
            ? String(hqCompleta.valor)
            : "",
        valor_pago:
          hqCompleta.valor_pago !== null && hqCompleta.valor_pago !== undefined
            ? String(hqCompleta.valor_pago)
            : "",
        colecao_id:
          hqCompleta.colecao && hqCompleta.colecao.length > 0
            ? String(hqCompleta.colecao[0].id)
            : "",
        ordem_colecao: "",
      });

      setAutorIds((hqCompleta.autor ?? []).map((autor: Autor) => autor.id));
      setDesenhistaIds((hqCompleta.desenhista ?? []).map((d: Desenhista) => d.id));
      setVolumeIds(relacoesVolume.map((relacao: { volume_id: number }) => relacao.volume_id));
      setEditingId(hq.id);
    } catch (err) {
      setError(getApiErrorMessage(err, "Erro ao carregar HQ para edição."));
    } finally {
      setLoadingEdit(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.titulo) {
      setError("O título é obrigatório.");
      return;
    }

    const payload = {
      titulo: form.titulo,
      descricao: form.descricao || undefined,
      capa_url: form.capa_url || undefined,
      editora_id: form.editora_id ? Number(form.editora_id) : undefined,
      numero_edicao: form.numero_edicao ? Number(form.numero_edicao) : undefined,
      formato: form.formato || undefined,
      quantidade_paginas: form.quantidade_paginas
        ? Number(form.quantidade_paginas)
        : undefined,
      data_publicacao: form.data_publicacao || undefined,
      valor: form.valor ? Number(form.valor) : undefined,
      valor_pago: form.valor_pago ? Number(form.valor_pago) : undefined,
    };

    const colecaoId = form.colecao_id ? Number(form.colecao_id) : null;
    const ordem = form.ordem_colecao ? Number(form.ordem_colecao) : null;

    try {
      setSaving(true);

      let hqId = editingId;

      if (hqId) {
        await atualizarHQ(hqId, payload);
      } else {
        const criada = await criarHQ(payload);
        hqId = criada.id;
      }

      await Promise.all([
        sincronizarAutoresDaHQ(hqId, autorIds),
        sincronizarDesenhistasDaHQ(hqId, desenhistaIds),
        sincronizarVolumesDaHQ(hqId, volumeIds),
        sincronizarColecaoDaHQ(hqId, colecaoId, ordem),
      ]);

      resetForm();
      await onChanged();
    } catch (err) {
      setError(getApiErrorMessage(err, "Erro ao salvar HQ."));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    setError("");

    try {
      await deletarHQ(id);

      if (editingId === id) {
        resetForm();
      }

      await onChanged();
    } catch (err) {
      setError(getApiErrorMessage(err, "Erro ao excluir HQ."));
    }
  }

  return (
    <div className="rounded-xl border border-[#28374e] bg-[#1d2a3d] p-6">
      <h2 className="text-xl font-bold text-white">HQs</h2>

      {error ? (
        <div className="mt-4 rounded-lg border border-red-900/60 bg-red-950/30 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-4 space-y-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-white">Título *</label>
            <input
              type="text"
              value={form.titulo}
              onChange={(e) => handleChange("titulo", e.target.value)}
              className="w-full rounded-lg border border-[#334155] bg-[#0f1726] px-4 py-3 text-white placeholder:text-slate-500 focus:border-red-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white">Capa (URL)</label>
            <input
              type="text"
              value={form.capa_url}
              onChange={(e) => handleChange("capa_url", e.target.value)}
              className="w-full rounded-lg border border-[#334155] bg-[#0f1726] px-4 py-3 text-white placeholder:text-slate-500 focus:border-red-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm text-white">Descrição</label>
          <textarea
            value={form.descricao}
            onChange={(e) => handleChange("descricao", e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-[#334155] bg-[#0f1726] px-4 py-3 text-white placeholder:text-slate-500 focus:border-red-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-white">Editora</label>
            <select
              value={form.editora_id}
              onChange={(e) => handleChange("editora_id", e.target.value)}
              className="w-full rounded-lg border border-[#334155] bg-[#0f1726] px-4 py-3 text-white focus:border-red-500 focus:outline-none"
            >
              <option value="">—</option>
              {editoras.map((editora) => (
                <option key={editora.id} value={editora.id}>
                  {editora.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-white">Nº edição</label>
            <input
              type="number"
              value={form.numero_edicao}
              onChange={(e) => handleChange("numero_edicao", e.target.value)}
              className="w-full rounded-lg border border-[#334155] bg-[#0f1726] px-4 py-3 text-white placeholder:text-slate-500 focus:border-red-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-white">Formato</label>
            <input
              type="text"
              value={form.formato}
              onChange={(e) => handleChange("formato", e.target.value)}
              placeholder="ex: TPB, Hardcover"
              className="w-full rounded-lg border border-[#334155] bg-[#0f1726] px-4 py-3 text-white placeholder:text-slate-500 focus:border-red-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white">Páginas</label>
            <input
              type="number"
              value={form.quantidade_paginas}
              onChange={(e) => handleChange("quantidade_paginas", e.target.value)}
              className="w-full rounded-lg border border-[#334155] bg-[#0f1726] px-4 py-3 text-white placeholder:text-slate-500 focus:border-red-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-white">Data publicação</label>
            <input
              type="date"
              value={form.data_publicacao}
              onChange={(e) => handleChange("data_publicacao", e.target.value)}
              className="w-full rounded-lg border border-[#334155] bg-[#0f1726] px-4 py-3 text-white focus:border-red-500 focus:outline-none [color-scheme:dark]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white">Valor</label>
            <input
              type="number"
              step="0.01"
              value={form.valor}
              onChange={(e) => handleChange("valor", e.target.value)}
              className="w-full rounded-lg border border-[#334155] bg-[#0f1726] px-4 py-3 text-white placeholder:text-slate-500 focus:border-red-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-white">Valor pago</label>
            <input
              type="number"
              step="0.01"
              value={form.valor_pago}
              onChange={(e) => handleChange("valor_pago", e.target.value)}
              className="w-full rounded-lg border border-[#334155] bg-[#0f1726] px-4 py-3 text-white placeholder:text-slate-500 focus:border-red-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white">Coleção</label>
            <select
              value={form.colecao_id}
              onChange={(e) => handleChange("colecao_id", e.target.value)}
              className="w-full rounded-lg border border-[#334155] bg-[#0f1726] px-4 py-3 text-white focus:border-red-500 focus:outline-none"
            >
              <option value="">—</option>
              {colecoes.map((colecao) => (
                <option key={colecao.id} value={colecao.id}>
                  {colecao.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        {form.colecao_id ? (
          <div>
            <label className="mb-2 block text-sm text-white">
              Ordem na coleção
            </label>
            <input
              type="number"
              value={form.ordem_colecao}
              onChange={(e) => handleChange("ordem_colecao", e.target.value)}
              className="w-full max-w-xs rounded-lg border border-[#334155] bg-[#0f1726] px-4 py-3 text-white placeholder:text-slate-500 focus:border-red-500 focus:outline-none"
            />
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-white">Autores</label>
            <CheckboxSelectList
              options={autores.map((autor) => ({ id: autor.id, label: autor.nome }))}
              selectedIds={autorIds}
              onToggle={(id: number) => toggle(autorIds, setAutorIds, id)}
              emptyMessage="Nenhum autor cadastrado ainda."
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white">Desenhistas</label>
            <CheckboxSelectList
              options={desenhistas.map((d) => ({ id: d.id, label: d.nome }))}
              selectedIds={desenhistaIds}
              onToggle={(id: number) => toggle(desenhistaIds, setDesenhistaIds, id)}
              emptyMessage="Nenhum desenhista cadastrado ainda."
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm text-white">
            Quantidade de volumes na HQ
          </label>
          <div className="flex flex-wrap gap-3">
            <input
              type="number"
              min={1}
              value={qtdVolumesRecentes}
              onChange={(e) => setQtdVolumesRecentes(e.target.value)}
              placeholder="ex: 8"
              className="w-full max-w-xs rounded-lg border border-[#334155] bg-[#0f1726] px-4 py-3 text-white placeholder:text-slate-500 focus:border-red-500 focus:outline-none"
            />

            <button
              type="button"
              onClick={handleSelecionarUltimosVolumes}
              className="rounded-lg border border-[#334155] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0f1726]"
            >
              Selecionar últimos volumes
            </button>
          </div>
          <p className="mt-2 text-xs text-[#7c95b8]">
            Informe quantos volumes essa HQ ocupa e clique no botão para
            marcar automaticamente os últimos volumes cadastrados na lista
            abaixo.
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm text-white">
            Volumes (encadernados que contêm esta HQ)
          </label>
          <CheckboxSelectList
            options={volumes.map((volume) => ({
              id: volume.id,
              label: `#${volume.numero_volume} · ${volume.titulo}`,
              sublabel: `(${volume.ano_publicacao})`,
            }))}
            selectedIds={volumeIds}
            onToggle={(id: number) => toggle(volumeIds, setVolumeIds, id)}
            emptyMessage="Nenhum volume cadastrado ainda. Cadastre volumes na aba Volumes."
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving || loadingEdit}
            className="rounded-xl bg-red-500 px-5 py-3 font-semibold text-white transition hover:bg-red-600 disabled:opacity-60"
          >
            {editingId ? "Salvar alterações" : "+ Cadastrar HQ"}
          </button>

          {editingId ? (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl border border-[#334155] px-5 py-3 font-semibold text-white transition hover:bg-[#0f1726]"
            >
              Cancelar
            </button>
          ) : null}
        </div>
      </form>

      <div className="mt-8 space-y-2 border-t border-[#28374e] pt-6">
        <h3 className="text-lg font-semibold text-white">HQs cadastradas</h3>

        {hqs.length === 0 ? (
          <p className="text-sm text-[#7c95b8]">Nenhuma HQ cadastrada ainda.</p>
        ) : (
          hqs.map((hq) => (
            <div
              key={hq.id}
              className="flex items-center justify-between rounded-lg border border-[#28374e] bg-[#0f1726] px-4 py-3"
            >
              <div>
                <p className="font-medium text-white">{hq.titulo}</p>
                <p className="text-sm text-[#7c95b8]">
                  {hq.editora?.nome ?? "Sem editora"}
                  {hq.numero_edicao ? ` · Edição ${hq.numero_edicao}` : ""}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => startEdit(hq)}
                  className="rounded-lg border border-[#334155] px-3 py-1.5 text-sm text-white transition hover:bg-[#1d2a3d]"
                >
                  Editar
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(hq.id)}
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
