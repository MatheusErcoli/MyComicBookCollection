"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Sidebar from "@/src/components/Sidebar";

import {
  BookIcon,
  GridIcon,
  BarIcon,
  ArchiveIcon,
  HeartIcon,
  SettingsIcon,
  SunIcon,
  LogoutIcon,
} from "@/src/components/icons";

import { logout } from "@/src/services/auth.service";
import { getStoredUser } from "@/src/services/auth-storage";
import { getApiErrorMessage } from "@/src/services/api";
import {
  atualizarItemColecao,
  buscarItemColecao,
  removerItemColecao,
} from "@/src/services/minhaColecaoItem";
import {
  listarRelacoesHqVolume,
  listarVolumes,
} from "@/src/services/admin.service";
import {
  HQ_USUARIO_STATUS_LABEL,
  HQUsuarioStatus,
  ItemColecao,
} from "@/src/types/minhaColecaoItem";
import { Volume } from "@/src/types/admin.types";

export default function DetalheColecaoPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const itemId = Number(params.id);

  const [email, setEmail] = useState("");
  const [item, setItem] = useState<ItemColecao | null>(null);
  const [volumes, setVolumes] = useState<Volume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [status, setStatus] = useState<HQUsuarioStatus | "">("");
  const [nota, setNota] = useState("");
  const [prioridade, setPrioridade] = useState("");
  const [dataAquisicao, setDataAquisicao] = useState("");
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);

  useEffect(() => {
    async function carregar() {
      await Promise.resolve();

      const usuario = getStoredUser();
      setEmail(usuario?.email ?? "");

      try {
        setLoading(true);

        const itemCarregado = await buscarItemColecao(itemId);
        setItem(itemCarregado);

        setStatus(itemCarregado.status ?? "");
        setNota(itemCarregado.nota !== null ? String(itemCarregado.nota) : "");
        setPrioridade(
          itemCarregado.prioridade !== null
            ? String(itemCarregado.prioridade)
            : ""
        );
        setDataAquisicao(
          itemCarregado.data_aquisicao
            ? itemCarregado.data_aquisicao.slice(0, 10)
            : ""
        );

        const relacoesVolume = await listarRelacoesHqVolume(
          itemCarregado.hq.id
        );

        if (relacoesVolume.length > 0) {
          const todosVolumes = await listarVolumes();
          const volumeIds = relacoesVolume.map((relacao) => relacao.volume_id);
          setVolumes(
            todosVolumes.filter((volume) => volumeIds.includes(volume.id))
          );
        }
      } catch (err) {
        setError(getApiErrorMessage(err, "Erro ao carregar HQ."));
      } finally {
        setLoading(false);
      }
    }

    if (!Number.isNaN(itemId)) {
      carregar();
    }
  }, [itemId]);

  async function handleSalvar() {
    setError("");

    try {
      setSaving(true);

      const atualizado = await atualizarItemColecao(itemId, {
        status: status || undefined,
        nota:
          status !== HQUsuarioStatus.WISHLIST && nota !== ""
            ? Number(nota)
            : null,
        prioridade:
          status === HQUsuarioStatus.WISHLIST && prioridade !== ""
            ? Number(prioridade)
            : null,
        data_aquisicao: dataAquisicao || null,
      });

      setItem(atualizado);
    } catch (err) {
      setError(getApiErrorMessage(err, "Erro ao salvar alterações."));
    } finally {
      setSaving(false);
    }
  }

  async function handleRemover() {
    setError("");

    try {
      setRemoving(true);
      await removerItemColecao(itemId);
      router.push("/minha-colecao");
    } catch (err) {
      setError(getApiErrorMessage(err, "Erro ao remover da coleção."));
      setRemoving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0f1726] text-white">
      <div className="flex min-h-screen">
        <Sidebar
          email={email}
          logout={logout}
          router={router}
          BookIcon={BookIcon}
          GridIcon={GridIcon}
          BarIcon={BarIcon}
          ArchiveIcon={ArchiveIcon}
          HeartIcon={HeartIcon}
          SettingsIcon={SettingsIcon}
          SunIcon={SunIcon}
          LogoutIcon={LogoutIcon}
        />

        <section className="flex-1 p-8">
          <button
            type="button"
            onClick={() => router.push("/minha-colecao")}
            className="text-sm text-[#9fb5d1] transition hover:text-white"
          >
            ← Voltar para Minha Coleção
          </button>

          {error ? (
            <div className="mt-4 rounded-xl border border-red-900/60 bg-red-950/30 px-5 py-4 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          {loading ? (
            <p className="mt-6 text-sm text-[#7c95b8]">Carregando...</p>
          ) : !item ? (
            <p className="mt-6 text-sm text-[#7c95b8]">
              HQ não encontrada na sua coleção.
            </p>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
              <div>
                <div className="aspect-[2/3] overflow-hidden rounded-xl border border-[#28374e] bg-[#1d2a3d]">
                  {item.hq.capa_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.hq.capa_url}
                      alt={item.hq.titulo}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-slate-500">
                      Sem capa
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleRemover}
                  disabled={removing}
                  className="mt-4 w-full rounded-xl border border-red-900/60 px-4 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-950/30 disabled:opacity-60"
                >
                  {removing ? "Removendo..." : "Remover da coleção"}
                </button>
              </div>

              <div>
                <h1 className="text-3xl font-bold text-white">
                  {item.hq.titulo}
                </h1>

                <p className="mt-1 text-[#9fb5d1]">
                  {item.hq.editora?.nome ?? "Sem editora"}
                  {item.hq.numero_edicao
                    ? ` · Edição ${item.hq.numero_edicao}`
                    : ""}
                </p>

                {item.hq.descricao ? (
                  <p className="mt-4 text-slate-300">{item.hq.descricao}</p>
                ) : null}

                <div className="mt-6 grid grid-cols-2 gap-4 rounded-xl border border-[#28374e] bg-[#1d2a3d] p-5 sm:grid-cols-3">
                  <div>
                    <p className="text-xs text-[#7c95b8]">Formato</p>
                    <p className="text-white">{item.hq.formato ?? "—"}</p>
                  </div>

                  <div>
                    <p className="text-xs text-[#7c95b8]">Páginas</p>
                    <p className="text-white">
                      {item.hq.quantidade_paginas ?? "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[#7c95b8]">Data publicação</p>
                    <p className="text-white">
                      {item.hq.data_publicacao
                        ? new Date(item.hq.data_publicacao).toLocaleDateString(
                            "pt-BR"
                          )
                        : "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[#7c95b8]">Valor</p>
                    <p className="text-white">
                      {item.hq.valor ? `R$ ${item.hq.valor}` : "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[#7c95b8]">Valor pago</p>
                    <p className="text-white">
                      {item.hq.valor_pago ? `R$ ${item.hq.valor_pago}` : "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[#7c95b8]">Coleção</p>
                    <p className="text-white">
                      {item.hq.colecao && item.hq.colecao.length > 0
                        ? item.hq.colecao[0].nome
                        : "—"}
                    </p>
                  </div>
                </div>

                {item.hq.autor && item.hq.autor.length > 0 ? (
                  <div className="mt-6">
                    <p className="text-sm text-[#7c95b8]">Autores</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {item.hq.autor.map((autor) => (
                        <span
                          key={autor.id}
                          className="rounded-full border border-[#334155] px-3 py-1 text-sm text-white"
                        >
                          {autor.nome}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                {item.hq.desenhista && item.hq.desenhista.length > 0 ? (
                  <div className="mt-4">
                    <p className="text-sm text-[#7c95b8]">Desenhistas</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {item.hq.desenhista.map((desenhista) => (
                        <span
                          key={desenhista.id}
                          className="rounded-full border border-[#334155] px-3 py-1 text-sm text-white"
                        >
                          {desenhista.nome}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                {volumes.length > 0 ? (
                  <div className="mt-4">
                    <p className="text-sm text-[#7c95b8]">
                      Volumes que contêm esta HQ
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {volumes.map((volume) => (
                        <span
                          key={volume.id}
                          className="rounded-full border border-[#334155] px-3 py-1 text-sm text-white"
                        >
                          #{volume.numero_volume} · {volume.titulo}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="mt-8 rounded-xl border border-[#28374e] bg-[#1d2a3d] p-5">
                  <h2 className="text-lg font-semibold text-white">
                    Minha leitura
                  </h2>

                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm text-white">
                        Status
                      </label>
                      <select
                        value={status}
                        onChange={(e) =>
                          setStatus(e.target.value as HQUsuarioStatus)
                        }
                        className="w-full rounded-lg border border-[#334155] bg-[#0f1726] px-4 py-3 text-white focus:border-red-500 focus:outline-none"
                      >
                        <option value="">—</option>
                        {Object.values(HQUsuarioStatus).map((valor) => (
                          <option key={valor} value={valor}>
                            {HQ_USUARIO_STATUS_LABEL[valor]}
                          </option>
                        ))}
                      </select>
                    </div>

                    {status !== HQUsuarioStatus.WISHLIST ? (
                      <div>
                        <label className="mb-2 block text-sm text-white">
                          Nota (0-10)
                        </label>
                        <input
                          type="number"
                          min={0}
                          max={10}
                          value={nota}
                          onChange={(e) => setNota(e.target.value)}
                          className="w-full rounded-lg border border-[#334155] bg-[#0f1726] px-4 py-3 text-white focus:border-red-500 focus:outline-none"
                        />
                      </div>
                    ) : null}

                    {status === HQUsuarioStatus.WISHLIST ? (
                      <div>
                        <label className="mb-2 block text-sm text-white">
                          Prioridade
                        </label>
                        <input
                          type="number"
                          value={prioridade}
                          onChange={(e) => setPrioridade(e.target.value)}
                          className="w-full rounded-lg border border-[#334155] bg-[#0f1726] px-4 py-3 text-white focus:border-red-500 focus:outline-none"
                        />
                      </div>
                    ) : null}

                    <div>
                      <label className="mb-2 block text-sm text-white">
                        Data de aquisição
                      </label>
                      <input
                        type="date"
                        value={dataAquisicao}
                        onChange={(e) => setDataAquisicao(e.target.value)}
                        className="w-full rounded-lg border border-[#334155] bg-[#0f1726] px-4 py-3 text-white focus:border-red-500 focus:outline-none [color-scheme:dark]"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSalvar}
                    disabled={saving}
                    className="mt-5 rounded-xl bg-red-500 px-5 py-3 font-semibold text-white transition hover:bg-red-600 disabled:opacity-60"
                  >
                    {saving ? "Salvando..." : "Salvar alterações"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
