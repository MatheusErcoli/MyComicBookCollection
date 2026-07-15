import { api } from "./api";
import { CollectionResponse } from "../types/colecaoPagina.types";

export interface FiltrosMinhaColecao {
  status?: string;
  search?: string;
  editoraId?: number;
  autorId?: number;
}

export async function buscarMinhaColecao(
  page = 1,
  limit = 20,
  filtros: FiltrosMinhaColecao = {}
) {
  const params = new URLSearchParams();

  params.set("page", String(page));
  params.set("limit", String(limit));

  if (filtros.status) {
    params.set("status", filtros.status);
  }

  if (filtros.search) {
    params.set("search", filtros.search);
  }

  if (filtros.editoraId) {
    params.set("editoraId", String(filtros.editoraId));
  }

  if (filtros.autorId) {
    params.set("autorId", String(filtros.autorId));
  }

  const { data } = await api.get<CollectionResponse>(
    `/minha-colecao?${params.toString()}`
  );

  return data;
}
