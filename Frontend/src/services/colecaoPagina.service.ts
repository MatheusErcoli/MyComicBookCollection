import { api } from "./api";
import { CollectionResponse } from "../types/colecaoPagina.types";

export async function buscarMinhaColecao(page = 1, limit = 20) {
  const { data } = await api.get<CollectionResponse>(`/minha-colecao?page=${page}&limit=${limit}`);

  return data;
}