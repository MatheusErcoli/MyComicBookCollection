"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Sidebar from "@/src/components/Sidebar";
import HQManager from "@/src/components/admin/HQManager";
import SimpleEntityManager from "@/src/components/admin/SimpleEntityManager";

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

import {
  atualizarAutor,
  atualizarColecao,
  atualizarDesenhista,
  atualizarEditora,
  atualizarVolume,
  criarAutor,
  criarColecao,
  criarDesenhista,
  criarEditora,
  criarVolume,
  deletarAutor,
  deletarColecao,
  deletarDesenhista,
  deletarEditora,
  deletarVolume,
  listarAutores,
  listarColecoes,
  listarDesenhistas,
  listarEditoras,
  listarHQs,
  listarVolumes,
} from "@/src/services/admin.service";

import {
  Autor,
  Colecao,
  Desenhista,
  Editora,
  HQ,
  Volume,
} from "@/src/types/admin.types";

type Tab = "hqs" | "volumes" | "colecoes" | "editoras" | "autores" | "desenhistas";

const tabs: { key: Tab; label: string }[] = [
  { key: "hqs", label: "HQs" },
  { key: "volumes", label: "Volumes" },
  { key: "colecoes", label: "Coleções" },
  { key: "editoras", label: "Editoras" },
  { key: "autores", label: "Autores" },
  { key: "desenhistas", label: "Desenhistas" },
];

export default function AdminPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("hqs");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [hqs, setHqs] = useState<HQ[]>([]);
  const [editoras, setEditoras] = useState<Editora[]>([]);
  const [autores, setAutores] = useState<Autor[]>([]);
  const [desenhistas, setDesenhistas] = useState<Desenhista[]>([]);
  const [colecoes, setColecoes] = useState<Colecao[]>([]);
  const [volumes, setVolumes] = useState<Volume[]>([]);

  async function carregarTudo() {
    const [hqsData, editorasData, autoresData, desenhistasData, colecoesData, volumesData] =
      await Promise.all([
        listarHQs(),
        listarEditoras(),
        listarAutores(),
        listarDesenhistas(),
        listarColecoes(),
        listarVolumes(),
      ]);

    setHqs(hqsData);
    setEditoras(editorasData);
    setAutores(autoresData);
    setDesenhistas(desenhistasData);
    setColecoes(colecoesData);
    setVolumes(volumesData);
  }

  useEffect(() => {
    const token = getAuthToken();

    if (!token) {
      router.push("/login");
      return;
    }

    const usuario = getStoredUser();

    async function iniciar() {
      try {
        setEmail(usuario?.email ?? "");
        await carregarTudo();
      } catch (err) {
        setError(getApiErrorMessage(err, "Erro ao carregar dados do admin."));
      } finally {
        setLoading(false);
      }
    }

    iniciar();
  }, [router]);

  async function handleChanged() {
    await carregarTudo();
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
          <header>
            <h1 className="text-[32px] font-bold leading-tight tracking-normal text-white">
              Admin
            </h1>
            <p className="mt-1 text-base text-[#a8c4e8]">Gerencie o catálogo</p>
          </header>

          <div className="mt-6 flex flex-wrap gap-2 border-b border-[#28374e] pb-3">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={
                  activeTab === tab.key
                    ? "rounded-lg bg-[#1d2a3d] px-4 py-2 text-sm font-semibold text-white"
                    : "rounded-lg px-4 py-2 text-sm font-medium text-[#9fb5d1] transition hover:bg-[#1d2a3d]"
                }
              >
                {tab.label}
              </button>
            ))}
          </div>

          {error ? (
            <div className="mt-6 rounded-xl border border-red-900/60 bg-red-950/30 px-5 py-4 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          <div className="mt-6">
            {loading ? (
              <p className="text-sm text-[#7c95b8]">Carregando...</p>
            ) : (
              <>
                {activeTab === "hqs" ? (
                  <HQManager
                    hqs={hqs}
                    editoras={editoras}
                    autores={autores}
                    desenhistas={desenhistas}
                    colecoes={colecoes}
                    volumes={volumes}
                    onChanged={handleChanged}
                  />
                ) : null}

                {activeTab === "volumes" ? (
                  <SimpleEntityManager<Volume>
                    title="Volumes"
                    pageSize={10}
                    fields={[
                      {
                        key: "numero_volume",
                        label: "Número do volume",
                        type: "number",
                        required: true,
                      },
                      {
                        key: "titulo",
                        label: "Título",
                        type: "text",
                        required: true,
                      },
                      {
                        key: "ano_publicacao",
                        label: "Ano de publicação",
                        type: "number",
                        required: true,
                      },
                    ]}
                    items={volumes}
                    onCreate={async (payload) => {
                      await criarVolume(payload);
                      await handleChanged();
                    }}
                    onUpdate={async (id, payload) => {
                      await atualizarVolume(id, payload);
                      await handleChanged();
                    }}
                    onDelete={async (id) => {
                      await deletarVolume(id);
                      await handleChanged();
                    }}
                    renderItemTitle={(item) => `#${item.numero_volume} · ${item.titulo}`}
                    renderItemSubtitle={(item) => `${item.ano_publicacao}`}
                  />
                ) : null}

                {activeTab === "colecoes" ? (
                  <SimpleEntityManager<Colecao>
                    title="Coleções"
                    fields={[
                      { key: "nome", label: "Nome", type: "text", required: true },
                      {
                        key: "descricao",
                        label: "Descrição",
                        type: "textarea",
                        colSpan: 2,
                      },
                      {
                        key: "ano_publicacao",
                        label: "Ano de publicação",
                        type: "number",
                      },
                      { key: "qtd_volumes", label: "Qtd. de volumes", type: "number" },
                    ]}
                    items={colecoes}
                    onCreate={async (payload) => {
                      await criarColecao(payload);
                      await handleChanged();
                    }}
                    onUpdate={async (id, payload) => {
                      await atualizarColecao(id, payload);
                      await handleChanged();
                    }}
                    onDelete={async (id) => {
                      await deletarColecao(id);
                      await handleChanged();
                    }}
                    renderItemTitle={(item) => item.nome}
                    renderItemSubtitle={(item) =>
                      item.ano_publicacao ? `${item.ano_publicacao}` : null
                    }
                  />
                ) : null}

                {activeTab === "editoras" ? (
                  <SimpleEntityManager<Editora>
                    title="Editoras"
                    fields={[
                      { key: "nome", label: "Nome", type: "text", required: true, colSpan: 2 },
                    ]}
                    items={editoras}
                    onCreate={async (payload) => {
                      await criarEditora(payload as { nome: string });
                      await handleChanged();
                    }}
                    onUpdate={async (id, payload) => {
                      await atualizarEditora(id, payload as { nome: string });
                      await handleChanged();
                    }}
                    onDelete={async (id) => {
                      await deletarEditora(id);
                      await handleChanged();
                    }}
                    renderItemTitle={(item) => item.nome}
                  />
                ) : null}

                {activeTab === "autores" ? (
                  <SimpleEntityManager<Autor>
                    title="Autores"
                    fields={[
                      { key: "nome", label: "Nome", type: "text", required: true, colSpan: 2 },
                    ]}
                    items={autores}
                    onCreate={async (payload) => {
                      await criarAutor(payload as { nome: string });
                      await handleChanged();
                    }}
                    onUpdate={async (id, payload) => {
                      await atualizarAutor(id, payload as { nome: string });
                      await handleChanged();
                    }}
                    onDelete={async (id) => {
                      await deletarAutor(id);
                      await handleChanged();
                    }}
                    renderItemTitle={(item) => item.nome}
                  />
                ) : null}

                {activeTab === "desenhistas" ? (
                  <SimpleEntityManager<Desenhista>
                    title="Desenhistas"
                    fields={[
                      { key: "nome", label: "Nome", type: "text", required: true, colSpan: 2 },
                    ]}
                    items={desenhistas}
                    onCreate={async (payload) => {
                      await criarDesenhista(payload as { nome: string });
                      await handleChanged();
                    }}
                    onUpdate={async (id, payload) => {
                      await atualizarDesenhista(id, payload as { nome: string });
                      await handleChanged();
                    }}
                    onDelete={async (id) => {
                      await deletarDesenhista(id);
                      await handleChanged();
                    }}
                    renderItemTitle={(item) => item.nome}
                  />
                ) : null}
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
