"use client";

import { useEffect, useMemo, useState } from "react";

import { getApiErrorMessage } from "@/src/services/api";
import { getStoredUser } from "@/src/services/auth-storage";
import { buscarMinhaColecao } from "@/src/services/colecaoPagina.service";
import {
  adicionarItemColecao,
  buscarHQsRecentes,
} from "@/src/services/minhaColecaoItem";
import { HQ } from "@/src/types/admin.types";
import { HQUsuarioStatus } from "@/src/types/minhaColecaoItem";

interface AdicionarHQModalProps {
  onClose: () => void;
  onAdicionado: () => void;
  statusPadrao?: HQUsuarioStatus;
  titulo?: string;
  subtitulo?: string;
}

export default function AdicionarHQModal({
  onClose,
  onAdicionado,
  statusPadrao = HQUsuarioStatus.NAO_LIDA,
  titulo = "Adicionar HQ",
  subtitulo = "Últimas HQs cadastradas no catálogo",
}: AdicionarHQModalProps) {
  const [hqs, setHqs] = useState<HQ[]>([]);
  const [idsNaColecao, setIdsNaColecao] = useState<number[]>([]);
  const [adicionandoId, setAdicionandoId] = useState<number | null>(null);
  const [adicionadosIds, setAdicionadosIds] = useState<number[]>([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function carregar() {
      const resultados = await Promise.allSettled([
        buscarHQsRecentes(30),
        buscarMinhaColecao(1, 1000),
      ]);

      const [resultadoHqs, resultadoColecao] = resultados;

      if (resultadoHqs.status === "fulfilled") {
        setHqs(resultadoHqs.value);
      } else {
        setError(
          getApiErrorMessage(resultadoHqs.reason, "Erro ao carregar HQs recentes.")
        );
      }

      if (resultadoColecao.status === "fulfilled") {
        setIdsNaColecao(resultadoColecao.value.items.map((item) => item.hq_id));
      }

      setLoading(false);
    }

    carregar();
  }, []);

  const disponiveis = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return hqs.filter((hq) => {
      const jaEstaNaColecao =
        idsNaColecao.includes(hq.id) || adicionadosIds.includes(hq.id);

      if (jaEstaNaColecao) {
        return false;
      }

      if (!termo) {
        return true;
      }

      return hq.titulo.toLowerCase().includes(termo);
    });
  }, [hqs, idsNaColecao, adicionadosIds, busca]);

  async function handleAdicionar(hq: HQ) {
    setError("");

    const usuario = getStoredUser();

    if (!usuario) {
      setError("Sessão expirada. Faça login novamente.");
      return;
    }

    try {
      setAdicionandoId(hq.id);

      await adicionarItemColecao({
        usuario_id: usuario.id,
        hq_id: hq.id,
        status: statusPadrao,
      });

      setAdicionadosIds((prev) => [...prev, hq.id]);
      onAdicionado();
    } catch (err) {
      setError(getApiErrorMessage(err, "Erro ao adicionar HQ na coleção."));
    } finally {
      setAdicionandoId(null);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-xl border border-[#28374e] bg-[#1d2a3d] p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">{titulo}</h2>
            <p className="mt-1 text-sm text-[#9fb5d1]">{subtitulo}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#334155] px-3 py-1.5 text-sm text-white transition hover:bg-[#0f1726]"
          >
            Fechar
          </button>
        </div>

        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Filtrar pelo título..."
          className="mt-4 w-full rounded-lg border border-[#334155] bg-[#0f1726] px-4 py-3 text-white placeholder:text-slate-500 focus:border-red-500 focus:outline-none"
        />

        {error ? (
          <div className="mt-4 rounded-lg border border-red-900/60 bg-red-950/30 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        <div className="mt-4 flex-1 space-y-2 overflow-y-auto">
          {loading ? (
            <p className="text-sm text-[#7c95b8]">Carregando...</p>
          ) : disponiveis.length === 0 ? (
            <p className="text-sm text-[#7c95b8]">
              Nenhuma HQ disponível para adicionar. Cadastre novas HQs na área
              de Admin.
            </p>
          ) : (
            disponiveis.map((hq) => (
              <div
                key={hq.id}
                className="flex items-center gap-4 rounded-lg border border-[#28374e] bg-[#0f1726] p-3"
              >
                <div className="h-16 w-12 shrink-0 overflow-hidden rounded bg-[#1d2a3d]">
                  {hq.capa_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={hq.capa_url}
                      alt={hq.titulo}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-white">
                    {hq.titulo}
                  </p>
                  <p className="truncate text-sm text-[#7c95b8]">
                    {hq.editora?.nome ?? "Sem editora"}
                    {hq.numero_edicao ? ` · Edição ${hq.numero_edicao}` : ""}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleAdicionar(hq)}
                  disabled={adicionandoId === hq.id}
                  className="shrink-0 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-60"
                >
                  {adicionandoId === hq.id ? "Adicionando..." : "+ Adicionar"}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
