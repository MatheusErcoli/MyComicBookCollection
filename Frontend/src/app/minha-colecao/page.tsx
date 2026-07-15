"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Sidebar from "@/src/components/Sidebar";
import Pagination from "@/src/components/Pagination";
import HQCard from "@/src/components/HQCard";
import AdicionarHQModal from "@/src/components/AdicionarHQModal";

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
import { buscarMinhaColecao } from "@/src/services/colecaoPagina.service";
import { CollectionResponse } from "@/src/types/colecaoPagina.types";
import { HQUsuarioStatus } from "@/src/types/minhaColecaoItem";

const emptyCollection: CollectionResponse = {
  totalItems: 0,
  totalPages: 0,
  currentPage: 1,
  items: [],
  editoras: [],
  autores: [],
};

export default function MinhaColecaoPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [modalAberto, setModalAberto] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const [busca, setBusca] = useState("");
  const [buscaDebounced, setBuscaDebounced] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("");
  const [editoraFiltro, setEditoraFiltro] = useState("");
  const [autorFiltro, setAutorFiltro] = useState("");

  const [colecao, setColecao] = useState<CollectionResponse>(emptyCollection);

 
  useEffect(() => {
    const timeout = setTimeout(() => {
      setBuscaDebounced(busca.trim());
      setPaginaAtual(1);
    }, 400);

    return () => clearTimeout(timeout);
  }, [busca]);


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

      const data = await buscarMinhaColecao(paginaAtual, 20, {
        search: buscaDebounced || undefined,
        status: statusFiltro || undefined,
        editoraId: editoraFiltro ? Number(editoraFiltro) : undefined,
        autorId: autorFiltro ? Number(autorFiltro) : undefined,
      });

      setColecao(data);
    }

    carregar();
  }, [
    paginaAtual,
    reloadKey,
    buscaDebounced,
    statusFiltro,
    editoraFiltro,
    autorFiltro,
    router,
  ]);

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Minha Coleção</h1>

              <p className="mt-1 text-[#9fb5d1]">
                Gerencie todos os seus quadrinhos
              </p>
            </div>

            <button
              type="button"
              onClick={() => setModalAberto(true)}
              className="rounded-xl bg-red-500 px-5 py-3 font-semibold text-white transition hover:bg-red-600"
            >
              + Adicionar HQ
            </button>
          </div>

          <div className="mt-8 rounded-xl border border-[#28374e] bg-[#1d2a3d] p-5">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Pesquisar HQ..."
                className="rounded-lg border border-[#334155] bg-[#0f1726] px-4 py-3 text-white placeholder:text-slate-500 focus:border-red-500 focus:outline-none"
              />

              <select
                value={statusFiltro}
                onChange={(e) => {
                  setStatusFiltro(e.target.value);
                  setPaginaAtual(1);
                }}
                className="rounded-lg border border-[#334155] bg-[#0f1726] px-4 py-3 text-white"
              >
                <option value="">Todas (incl. wishlist)</option>
                <option value={HQUsuarioStatus.NAO_LIDA}>Não lidas</option>
                <option value={HQUsuarioStatus.LENDO}>Lendo</option>
                <option value={HQUsuarioStatus.LIDA}>Lidas</option>
              </select>

              <select
                value={editoraFiltro}
                onChange={(e) => {
                  setEditoraFiltro(e.target.value);
                  setPaginaAtual(1);
                }}
                className="rounded-lg border border-[#334155] bg-[#0f1726] px-4 py-3 text-white"
              >
                <option value="">Todas as editoras</option>

                {colecao.editoras.map((editora) => (
                  <option key={editora.id} value={editora.id}>
                    {editora.nome}
                  </option>
                ))}
              </select>

              <select
                value={autorFiltro}
                onChange={(e) => {
                  setAutorFiltro(e.target.value);
                  setPaginaAtual(1);
                }}
                className="rounded-lg border border-[#334155] bg-[#0f1726] px-4 py-3 text-white"
              >
                <option value="">Todos os autores</option>

                {colecao.autores.map((autor) => (
                  <option key={autor.id} value={autor.id}>
                    {autor.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {colecao.items.length === 0 ? (
            <div className="mt-8 flex min-h-[150px] items-center justify-center rounded-xl border border-[#28374e] bg-[#1d2a3d] px-5 text-center">
              <p className="text-base text-[#9fb5d1]">
                Nenhuma HQ encontrada com esses filtros.
              </p>
            </div>
          ) : (
            <>
              <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {colecao.items.map((hq) => (
                  <HQCard key={hq.id} hq={hq} />
                ))}
              </div>

              <Pagination
                currentPage={colecao.currentPage}
                totalPages={colecao.totalPages}
                onPageChange={setPaginaAtual}
              />
            </>
          )}
        </section>
      </div>

      {modalAberto ? (
        <AdicionarHQModal
          onClose={() => setModalAberto(false)}
          onAdicionado={() => setReloadKey((key) => key + 1)}
        />
      ) : null}
    </main>
  );
}
