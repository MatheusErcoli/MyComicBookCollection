"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Sidebar from "@/src/components/Sidebar";
import Pagination from "@/src/components/Pagination";
import HQTable from "@/src/components/HQTable";

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
import { buscarMinhaColecao } from "@/src/services/colecaoPagina.service";
import { CollectionResponse } from "@/src/types/colecaoPagina.types";

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

  const [colecao, setColecao] = useState<CollectionResponse>(emptyCollection);

  useEffect(() => {
    async function carregar() {
      const usuario = getStoredUser();

      setEmail(usuario?.email ?? "");

      const data = await buscarMinhaColecao(paginaAtual);

      setColecao(data);
    }

    carregar();
  }, [paginaAtual]);

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

            <button className="rounded-xl bg-red-500 px-5 py-3 font-semibold text-white transition hover:bg-red-600">
              + Adicionar HQ
            </button>
          </div>

          <div className="mt-8 rounded-xl border border-[#28374e] bg-[#1d2a3d] p-5">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
              <input
                type="text"
                placeholder="Pesquisar HQ..."
                className="rounded-lg border border-[#334155] bg-[#0f1726] px-4 py-3 text-white placeholder:text-slate-500 focus:border-red-500 focus:outline-none"
              />

              <select className="rounded-lg border border-[#334155] bg-[#0f1726] px-4 py-3 text-white">
                <option>Todas (incl. wishlist)</option>
                <option>Não lidas</option>
                <option>Lendo</option>
                <option>Lidas</option>
              </select>

              <select className="rounded-lg border border-[#334155] bg-[#0f1726] px-4 py-3 text-white">
                <option>Todas as editoras</option>

                {colecao.editoras.map((editora) => (
                  <option key={editora.id} value={editora.id}>
                    {editora.nome}
                  </option>
                ))}
              </select>

              <select className="rounded-lg border border-[#334155] bg-[#0f1726] px-4 py-3 text-white">
                <option>Todos os autores</option>

                {colecao.autores.map((autor) => (
                  <option key={autor.id} value={autor.id}>
                    {autor.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-8">
            <HQTable hqs={colecao.items} />
          </div>

          <Pagination
            currentPage={colecao.currentPage}
            totalPages={colecao.totalPages}
            onPageChange={setPaginaAtual}
          />
        </section>
      </div>
    </main>
  );
}
