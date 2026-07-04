export interface Editora {
  id: number;
  nome: string;
}

export interface Autor {
  id: number;
  nome: string;
}

export interface HQ {
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
    valor_pago: number | null;

    editora?: Editora;

    autor: Autor[];
  };
}

export interface CollectionResponse {
  hqs: HQ[];
  editoras: Editora[];
  autores: Autor[];
}