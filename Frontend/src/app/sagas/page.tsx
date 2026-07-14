"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

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
  BookmarkIcon,
} from "@/src/components/icons";

import { logout } from "@/src/services/auth.service";
import { getAuthToken, getStoredUser } from "@/src/services/auth-storage";
import { getApiErrorMessage } from "@/src/services/api";
import { listarColecoes } from "@/src/services/admin.service";
import { buscarMinhaColecao } from "@/src/services/colecaoPagina.service";
import { Colecao } from "@/src/types/admin.types";

interface SagaComProgresso extends Colecao {
  ownedCount: number;
  totalCount: number;
  percent: number;
}

export default function SagasPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [colecoes, setColecoes] = useState<Colecao[]>([]);
  const [ownedHqIds, setOwnedHqIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        const [colecoesData, minhaColecao] = await Promise.all([
          listarColecoes(),
          buscarMinhaColecao(1, 1000),
        ]);

        setColecoes(colecoesData);
        setOwnedHqIds(minhaColecao.items.map((item) => item.hq_id));
      } catch (err) {
        setError(getApiErrorMessage(err, "Erro ao carregar as sagas."));
      } finally {
        setLoading(false);
      }
    }

    carregar();
  }, [router]);

  const sagas = useMemo<SagaComProgresso[]>(() => {
    return colecoes.map((colecao) => {
      const hqsDaSaga = colecao.hq ?? [];
      const totalCatalogado = hqsDaSaga.length;

      const totalCount =
        colecao.qtd_volumes && colecao.qtd_volumes > 0
          ? colecao.qtd_volumes
          : totalCatalogado;

      const ownedCount = hqsDaSaga.filter((hq) =>
        ownedHqIds.includes(hq.id)
      ).length;

      const percent =
        totalCount > 0 ? Math.round((ownedCount / totalCount) * 100) : 0;

      return {
        ...colecao,
        ownedCount,
        totalCount,
        percent,
      };
    });
  }, [colecoes, ownedHqIds]);

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
          <header>
            <h1 className="text-[32px] font-bold leading-tight tracking-normal text-white">
              Sagas & Arcos
            </h1>
            <p className="mt-1 text-base text-[#a8c4e8]">
              Acompanhe o progresso das suas coleções
            </p>
          </header>

          {error ? (
            <div className="mt-8 rounded-xl border border-red-900/60 bg-red-950/30 px-5 py-4 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          <div className="mt-8">
            {loading ? (
              <p className="text-sm text-[#7c95b8]">Carregando...</p>
            ) : sagas.length === 0 ? (
              <div className="flex min-h-[122px] items-center justify-center rounded-xl border border-[#28374e] bg-[#1d2a3d] px-5 text-center">
                <p className="text-base text-[#a8c4e8]">
                  Nenhuma saga cadastrada ainda. Cadastre uma coleção na área
                  de Admin.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {sagas.map((saga) => (
                  <article
                    key={saga.id}
                    className="rounded-xl border border-[#28374e] bg-[#1d2a3d] p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-bold text-white">
                          {saga.nome}
                        </h2>
                        {saga.ano_publicacao ? (
                          <p className="mt-0.5 text-sm text-[#7c95b8]">
                            {saga.ano_publicacao}
                          </p>
                        ) : null}
                      </div>

                      <BookmarkIcon className="h-5 w-5 shrink-0 text-[#7c95b8]" />
                    </div>

                    {saga.descricao ? (
                      <p className="mt-4 text-sm text-[#a8c4e8]">
                        {saga.descricao}
                      </p>
                    ) : null}

                    <div className="mt-5 flex items-center justify-between text-sm">
                      <span className="text-[#a8c4e8]">
                        {saga.ownedCount} / {saga.totalCount} volumes
                      </span>
                      <span className="font-semibold text-white">
                        {saga.percent}%
                      </span>
                    </div>

                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#0f1726]">
                      <div
                        className="h-full rounded-full bg-red-500 transition-all"
                        style={{ width: `${Math.min(saga.percent, 100)}%` }}
                      />
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
