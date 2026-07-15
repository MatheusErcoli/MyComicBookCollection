import { api } from "./api";
import { CollectionResponse } from "../types/colecaoPagina.types";

export async function buscarMinhaColecao(page = 1, limit = 20, status?: string) {
  const statusQuery = status ? `&status=${encodeURIComponent(status)}` : "";

  const { data } = await api.get<CollectionResponse>(
    `/minha-colecao?page=${page}&limit=${limit}${statusQuery}`
  );

  return data;
}