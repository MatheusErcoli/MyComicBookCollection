export interface UltimaHQ {
  id: number;
  usuario_id: number;
  hq_id: number;
  status: string;
  nota: number | null;
  prioridade: number | null;
  data_aquisicao: string | null;

  hq: {
    id: number;
    titulo: string;
    numero_edicao: number | null;
    capa_url: string | null;
    valor_pago: string | null;

    editora: {
      id: number;
      nome: string;
    } | null;
  };
}

export interface DashboardResumo {
  totalHQs: number;
  lidas: number;
  lendo: number;
  naoLidas: number;
  wishlist: number;
  valorColecao: number;
  totalInvestido: number;
  ultimasAdicionadas: UltimaHQ[];
}