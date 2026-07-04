import { api } from "./api";
import { CollectionResponse } from "../types/colecaoPagina.types";

export async function buscarMinhaColecao() {
  const { data } = await api.get<CollectionResponse>("/minha-colecao");

  return data;
}