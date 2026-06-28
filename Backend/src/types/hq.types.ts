export interface HQAttributes {
  id: number;
  titulo: string;
  descricao?: string;
  data_publicacao?: Date;
  numero_edicao?: number;
  capa_url?: string;
  valor?: number;
  valor_pago?: number;
  formato?: string;
  quantidade_paginas?: number;
  lido?: boolean;
  editora_id?: number;
  created_at?: Date;
  updated_at?: Date;
}