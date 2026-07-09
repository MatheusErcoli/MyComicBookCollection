import { HQ } from "./admin.types";

export enum HQUsuarioStatus {
  LIDA = "LIDA",
  LENDO = "LENDO",
  NAO_LIDA = "NAO_LIDA",
  WISHLIST = "WISHLIST",
}

export const HQ_USUARIO_STATUS_LABEL: Record<HQUsuarioStatus, string> = {
  [HQUsuarioStatus.LIDA]: "Lida",
  [HQUsuarioStatus.LENDO]: "Lendo",
  [HQUsuarioStatus.NAO_LIDA]: "Não lida",
  [HQUsuarioStatus.WISHLIST]: "Wishlist",
};

export interface ItemColecao {
  id: number;
  usuario_id: number;
  hq_id: number;
  status: HQUsuarioStatus | null;
  nota: number | null;
  prioridade: number | null;
  data_aquisicao: string | null;

  hq: HQ;
}

export interface AdicionarItemColecaoPayload {
  usuario_id: number;
  hq_id: number;
  status?: HQUsuarioStatus;
}

export interface AtualizarItemColecaoPayload {
  status?: HQUsuarioStatus;
  nota?: number | null;
  prioridade?: number | null;
  data_aquisicao?: string | null;
}
