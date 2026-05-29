export interface ColecaoAttributes {
  id: number;
  nome: string;
  descricao: string;
  ano_publicacao: number;
  qtd_volumes: number;
  created_at?: Date;
  updated_at?: Date;
}