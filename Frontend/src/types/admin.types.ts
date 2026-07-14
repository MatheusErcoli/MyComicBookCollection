export interface Editora {
  id: number;
  nome: string;
}

export interface Autor {
  id: number;
  nome: string;
}

export interface Desenhista {
  id: number;
  nome: string;
}

export interface SagaHQItem {
  id: number;
  titulo: string;
  capa_url?: string | null;
  editora?: Editora | null;
  HQColecao?: { ordem: number | null } | null;
}

export interface Colecao {
  id: number;
  nome: string;
  descricao?: string | null;
  ano_publicacao?: number | null;
  qtd_volumes?: number | null;
  hq?: SagaHQItem[];
}

export interface Volume {
  id: number;
  numero_volume: number;
  titulo: string;
  ano_publicacao: number;
}

export interface HQ {
  id: number;
  titulo: string;
  descricao?: string | null;
  data_publicacao?: string | null;
  numero_edicao?: number | null;
  capa_url?: string | null;
  valor?: number | null;
  valor_pago?: number | null;
  formato?: string | null;
  quantidade_paginas?: number | null;
  editora_id?: number | null;

  editora?: Editora | null;
  autor?: Autor[];
  desenhista?: Desenhista[];
  colecao?: Colecao[];
}

export interface HQAutorRelacao {
  id: number;
  hq_id: number;
  autor_id: number;
}

export interface HQDesenhistaRelacao {
  id: number;
  hq_id: number;
  desenhista_id: number;
}

export interface HQColecaoRelacao {
  id: number;
  hq_id: number;
  colecao_id: number;
  ordem?: number | null;
}

export interface HQVolumeRelacao {
  id: number;
  hq_id: number;
  volume_id: number;
}

export interface HQFormPayload {
  titulo: string;
  descricao?: string;
  data_publicacao?: string;
  numero_edicao?: number;
  capa_url?: string;
  valor?: number;
  valor_pago?: number;
  formato?: string;
  quantidade_paginas?: number;
  editora_id?: number;
}
