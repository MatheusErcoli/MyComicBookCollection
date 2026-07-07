import { api } from "./api";
import {
  Autor,
  Colecao,
  Desenhista,
  Editora,
  HQ,
  HQAutorRelacao,
  HQColecaoRelacao,
  HQDesenhistaRelacao,
  HQFormPayload,
  HQVolumeRelacao,
  Volume,
} from "../types/admin.types";

interface PaginacaoResponse<T> {
  totalItems: number;
  data: T[];
  totalPages: number;
  currentPage: number;
}

const ALL_LIMIT = 1000;

export async function listarEditoras() {
  const { data } = await api.get<PaginacaoResponse<Editora>>(
    `/editora?limit=${ALL_LIMIT}`
  );
  return data.data;
}

export async function criarEditora(payload: { nome: string }) {
  const { data } = await api.post<Editora>("/editora", payload);
  return data;
}

export async function atualizarEditora(id: number, payload: { nome: string }) {
  const { data } = await api.put<Editora>(`/editora/${id}`, payload);
  return data;
}

export async function deletarEditora(id: number) {
  await api.delete(`/editora/${id}`);
}

export async function listarAutores() {
  const { data } = await api.get<PaginacaoResponse<Autor>>(
    `/autor?limit=${ALL_LIMIT}`
  );
  return data.data;
}

export async function criarAutor(payload: { nome: string }) {
  const { data } = await api.post<Autor>("/autor", payload);
  return data;
}

export async function atualizarAutor(id: number, payload: { nome: string }) {
  const { data } = await api.put<Autor>(`/autor/${id}`, payload);
  return data;
}

export async function deletarAutor(id: number) {
  await api.delete(`/autor/${id}`);
}

export async function listarDesenhistas() {
  const { data } = await api.get<PaginacaoResponse<Desenhista>>(
    `/desenhista?limit=${ALL_LIMIT}`
  );
  return data.data;
}

export async function criarDesenhista(payload: { nome: string }) {
  const { data } = await api.post<Desenhista>("/desenhista", payload);
  return data;
}

export async function atualizarDesenhista(id: number, payload: { nome: string }) {
  const { data } = await api.put<Desenhista>(`/desenhista/${id}`, payload);
  return data;
}

export async function deletarDesenhista(id: number) {
  await api.delete(`/desenhista/${id}`);
}

export async function listarColecoes() {
  const { data } = await api.get<PaginacaoResponse<Colecao>>(
    `/colecao?limit=${ALL_LIMIT}`
  );
  return data.data;
}

export async function criarColecao(payload: Partial<Colecao>) {
  const { data } = await api.post<Colecao>("/colecao", payload);
  return data;
}

export async function atualizarColecao(id: number, payload: Partial<Colecao>) {
  const { data } = await api.put<Colecao>(`/colecao/${id}`, payload);
  return data;
}

export async function deletarColecao(id: number) {
  await api.delete(`/colecao/${id}`);
}

export async function listarVolumes() {
  const { data } = await api.get<PaginacaoResponse<Volume>>(
    `/volume?limit=${ALL_LIMIT}`
  );
  return data.data;
}

export async function criarVolume(payload: Partial<Volume>) {
  const { data } = await api.post<Volume>("/volume", payload);
  return data;
}

export async function atualizarVolume(id: number, payload: Partial<Volume>) {
  const { data } = await api.put<Volume>(`/volume/${id}`, payload);
  return data;
}

export async function deletarVolume(id: number) {
  await api.delete(`/volume/${id}`);
}

export async function listarHQs() {
  const { data } = await api.get<PaginacaoResponse<HQ>>(`/hq?limit=${ALL_LIMIT}`);
  return data.data;
}

export async function buscarHQ(id: number) {
  const { data } = await api.get<HQ>(`/hq/${id}`);
  return data;
}

export async function criarHQ(payload: HQFormPayload) {
  const { data } = await api.post<HQ>("/hq", payload);
  return data;
}

export async function atualizarHQ(id: number, payload: HQFormPayload) {
  const { data } = await api.put<HQ>(`/hq/${id}`, payload);
  return data;
}

export async function deletarHQ(id: number) {
  await api.delete(`/hq/${id}`);
}

async function listarRelacoesHqAutor(hqId: number) {
  const { data } = await api.get<PaginacaoResponse<HQAutorRelacao>>(
    `/hq-autor?limit=${ALL_LIMIT}`
  );
  return data.data.filter((relacao) => relacao.hq_id === hqId);
}

export async function sincronizarAutoresDaHQ(hqId: number, autorIds: number[]) {
  const existentes = await listarRelacoesHqAutor(hqId);
  const existentesIds = existentes.map((relacao) => relacao.autor_id);

  const paraAdicionar = autorIds.filter((id) => !existentesIds.includes(id));
  const paraRemover = existentes.filter(
    (relacao) => !autorIds.includes(relacao.autor_id)
  );

  await Promise.all([
    ...paraAdicionar.map((autor_id) =>
      api.post("/hq-autor", { hq_id: hqId, autor_id })
    ),
    ...paraRemover.map((relacao) => api.delete(`/hq-autor/${relacao.id}`)),
  ]);
}

async function listarRelacoesHqDesenhista(hqId: number) {
  const { data } = await api.get<PaginacaoResponse<HQDesenhistaRelacao>>(
    `/hq-desenhista?limit=${ALL_LIMIT}`
  );
  return data.data.filter((relacao) => relacao.hq_id === hqId);
}

export async function sincronizarDesenhistasDaHQ(
  hqId: number,
  desenhistaIds: number[]
) {
  const existentes = await listarRelacoesHqDesenhista(hqId);
  const existentesIds = existentes.map((relacao) => relacao.desenhista_id);

  const paraAdicionar = desenhistaIds.filter(
    (id) => !existentesIds.includes(id)
  );
  const paraRemover = existentes.filter(
    (relacao) => !desenhistaIds.includes(relacao.desenhista_id)
  );

  await Promise.all([
    ...paraAdicionar.map((desenhista_id) =>
      api.post("/hq-desenhista", { hq_id: hqId, desenhista_id })
    ),
    ...paraRemover.map((relacao) => api.delete(`/hq-desenhista/${relacao.id}`)),
  ]);
}

async function listarRelacoesHqColecao(hqId: number) {
  const { data } = await api.get<PaginacaoResponse<HQColecaoRelacao>>(
    `/hq-colecao?limit=${ALL_LIMIT}`
  );
  return data.data.filter((relacao) => relacao.hq_id === hqId);
}

export async function sincronizarColecaoDaHQ(
  hqId: number,
  colecaoId: number | null,
  ordem: number | null
) {
  const existentes = await listarRelacoesHqColecao(hqId);

  await Promise.all(
    existentes
      .filter((relacao) => relacao.colecao_id !== colecaoId)
      .map((relacao) => api.delete(`/hq-colecao/${relacao.id}`))
  );

  if (colecaoId === null) {
    return;
  }

  const relacaoAtual = existentes.find(
    (relacao) => relacao.colecao_id === colecaoId
  );

  if (relacaoAtual) {
    await api.put(`/hq-colecao/${relacaoAtual.id}`, {
      ordem: ordem ?? undefined,
    });
    return;
  }

  await api.post("/hq-colecao", {
    hq_id: hqId,
    colecao_id: colecaoId,
    ordem: ordem ?? undefined,
  });
}

export async function listarRelacoesHqVolume(hqId: number) {
  const { data } = await api.get<HQVolumeRelacao[]>(`/hq-volume/hq/${hqId}`);
  return data;
}

export async function sincronizarVolumesDaHQ(
  hqId: number,
  volumeIds: number[]
) {
  const existentes = await listarRelacoesHqVolume(hqId);
  const existentesIds = existentes.map((relacao) => relacao.volume_id);

  const paraAdicionar = volumeIds.filter((id) => !existentesIds.includes(id));
  const paraRemover = existentes.filter(
    (relacao) => !volumeIds.includes(relacao.volume_id)
  );

  await Promise.all([
    ...paraAdicionar.map((volume_id) =>
      api.post("/hq-volume", { hq_id: hqId, volume_id })
    ),
    ...paraRemover.map((relacao) => api.delete(`/hq-volume/${relacao.id}`)),
  ]);
}
