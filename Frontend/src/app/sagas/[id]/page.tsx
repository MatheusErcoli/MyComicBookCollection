"use client";

import { useEffect, useMemo, useState } from "react";
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
import { getAuthToken, getStoredUser } from "@/src/services/auth-storage";
import { getApiErrorMessage } from "@/src/services/api";
import { buscarColecao } from "@/src/services/admin.service";
import { buscarMinhaColecao } from "@/src/services/colecaoPagina.service";
import { atualizarItemColecao } from "@/src/services/minhaColecaoItem";
import { Colecao, SagaHQItem } from "@/src/types/admin.types";
import { HQUsuarioStatus } from "@/src/types/minhaColecaoItem";

interface HQPossuida {
  itemId: number;
  status: HQUsuarioStatus | null;
}

export default function SagaDetalhePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const sagaId = Number(params.id);

  const [email, setEmail] = useState("");
  const [saga, setSaga] = useState<Colecao | null>(null);
  const [possuidas, setPossuidas] = useState<Record<number, HQPossuida>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [atualizandoId, setAtualizandoId] = useState<number | null>(null);

  useEffect(() => {
    const token = getAuthToken();

    if (!token) {
      router.push("/login");
      return;
    }

    async function carregar() {
      await Promise.resolve();

      const usuario = getStoredUser();
      setEmail(usuario?.email ?? "");

      try {
        const [sagaData, minhaColecao] = await Promise.all([
          buscarColecao(sagaId),
          buscarMinhaColecao(1, 1000),
        ]);

        setSaga(sagaData);

        const mapa: Record<number, HQPossuida> = {};
        minhaColecao.items.forEach((item) => {
          mapa[item.hq_id] = {
            itemId: item.id,
            status: (item.status as HQUsuarioStatus) ?? null,
          };
        });
        setPossuidas(mapa);
      } catch (err) {
        setError(getApiErrorMessage(err, "Erro ao carregar a saga."));
      } finally {
        setLoading(false);
      }
    }

    if (!Number.isNaN(sagaId)) {
      carregar();
    }
  }, [sagaId, router]);

  const hqsOrdenadas = useMemo<SagaHQItem[]>(() => {
    const lista = saga?.hq ?? [];

    return [...lista].sort((a, b) => {
      const ordemA = a.HQColecao?.ordem ?? Number.MAX_SAFE_INTEGER;
      const ordemB = b.HQColecao?.ordem ?? Number.MAX_SAFE_INTEGER;

      if (ordemA !== ordemB) {
        return ordemA - ordemB;
      }

      return a.id - b.id;
    });
  }, [saga]);

  const totalCount = useMemo(() => {
    if (saga?.qtd_volumes && saga.qtd_volumes > 0) {
      return saga.qtd_volumes;
    }

    return hqsOrdenadas.length;
  }, [saga, hqsOrdenadas]);

  const ownedCount = useMemo(() => {
    return hqsOrdenadas.filter((hq) => possuidas[hq.id]).length;
  }, [hqsOrdenadas, possuidas]);

  const percent = totalCount > 0 ? Math.round((ownedCount / totalCount) * 100) : 0;

  async function handleToggleLida(hq: SagaHQItem) {
    const possuida = possuidas[hq.id];

    if (!possuida) {
      return;
    }

    const novoStatus =
      possuida.status === HQUsuarioStatus.LIDA
        ? HQUsuarioStatus.NAO_LIDA
        : HQUsuarioStatus.LIDA;

    setError("");

    try {
      setAtualizandoId(hq.id);

      await atualizarItemColecao(possuida.itemId, { status: novoStatus });

      setPossuidas((prev) => ({
        ...prev,
        [hq.id]: { ...prev[hq.id], status: novoStatus },
      }));
    } catch (err) {
      setError(getApiErrorMessage(err, "Erro ao atualizar status de leitura."));
    } finally {
      setAtualizandoId(null);
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

        <section className="flex-1 px-5 py-6 md:px-8 lg:px-8">
          <button
            type="button"
            onClick={() => router.push("/sagas")}
            className="flex items-center gap-2 text-sm text-[#9fb5d1] transition hover:text-white"
          >
            ← Voltar
          </button>

          {error ? (
            <div className="mt-4 rounded-xl border border-red-900/60 bg-red-950/30 px-5 py-4 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          {loading ? (
            <p className="mt-6 text-sm text-[#7c95b8]">Carregando...</p>
          ) : !saga ? (
            <p className="mt-6 text-sm text-[#7c95b8]">
              Saga não encontrada.
            </p>
          ) : (
            <>
              <h1 className="mt-4 text-[32px] font-bold leading-tight text-white">
                {saga.nome}
              </h1>

              {saga.ano_publicacao ? (
                <p className="mt-1 text-base text-[#7c95b8]">
                  {saga.ano_publicacao}
                </p>
              ) : null}

              {saga.descricao ? (
                <p className="mt-2 text-white">{saga.descricao}</p>
              ) : null}

              <div className="mt-6 rounded-xl border border-[#28374e] bg-[#1d2a3d] p-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#a8c4e8]">
                    Progresso: {ownedCount} / {totalCount}
                  </span>
                  <span className="font-semibold text-white">{percent}%</span>
                </div>

                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#0f1726]">
                  <div
                    className="h-full rounded-full bg-red-500 transition-all"
                    style={{ width: `${Math.min(percent, 100)}%` }}
                  />
                </div>
              </div>

              <h2 className="mt-8 text-xl font-bold text-white">
                Ordem de leitura
              </h2>

              {hqsOrdenadas.length === 0 ? (
                <p className="mt-3 text-sm text-[#7c95b8]">
                  Nenhuma HQ vinculada a esta saga ainda. Vincule HQs a ela na
                  área de Admin.
                </p>
              ) : (
                <div className="mt-3 space-y-3">
                  {hqsOrdenadas.map((hq, index) => {
                    const possuida = possuidas[hq.id];
                    const lida = possuida?.status === HQUsuarioStatus.LIDA;

                    return (
                      <div
                        key={hq.id}
                        onClick={() => router.push(`/minha-colecao/${possuida?.itemId ?? ""}`)}
                        className={
                          possuida
                            ? "flex cursor-pointer items-center gap-4 rounded-xl border border-[#28374e] bg-[#1d2a3d] p-4 transition hover:border-red-500"
                            : "flex items-center gap-4 rounded-xl border border-[#28374e] bg-[#1d2a3d] p-4 opacity-70"
                        }
                      >
                        <span className="w-5 shrink-0 text-sm text-[#7c95b8]">
                          {index + 1}
                        </span>

                        <div className="h-14 w-10 shrink-0 overflow-hidden rounded bg-[#0f1726]">
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
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleLida(hq);
                          }}
                          disabled={!possuida || atualizandoId === hq.id}
                          title={
                            possuida
                              ? "Marcar como lida"
                              : "Adicione esta HQ à sua coleção para marcar como lida"
                          }
                          className={
                            lida
                              ? "flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500 text-white disabled:opacity-60"
                              : "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#7c95b8] disabled:opacity-40"
                          }
                        >
                          {lida ? (
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              className="h-3.5 w-3.5"
                            >
                              <path d="M5 13l4 4L19 7" />
                            </svg>
                          ) : null}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}
