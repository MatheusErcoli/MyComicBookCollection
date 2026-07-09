import { api } from "./api";
import { HQ } from "../types/admin.types";
import {
  AdicionarItemColecaoPayload,
  AtualizarItemColecaoPayload,
  ItemColecao,
} from "../types/minhaColecaoItem";

interface PaginacaoResponse<T> {
  totalItems: number;
  data: T[];
  totalPages: number;
  currentPage: number;
}

export async function buscarItemColecao(id: number) {
  const { data } = await api.get<ItemColecao>(`/hq-usuario/${id}`);
  return data;
}

export async function atualizarItemColecao(
  id: number,
  payload: AtualizarItemColecaoPayload
) {
  const { data } = await api.put<ItemColecao>(`/hq-usuario/${id}`, payload);
  return data;
}

export async function removerItemColecao(id: number) {
  await api.delete(`/hq-usuario/${id}`);
}

export async function adicionarItemColecao(
  payload: AdicionarItemColecaoPayload
) {
  const { data } = await api.post<ItemColecao>("/hq-usuario", payload);
  return data;
}

// HQs mais recentes cadastradas no catálogo (pelo admin), para o modal de "Adicionar HQ"
export async function buscarHQsRecentes(limit = 30) {
  const { data } = await api.get<PaginacaoResponse<HQ>>(
    `/hq?limit=${limit}&page=1`
  );
  return data.data;
}
