export interface HQUsuarioAttributes {
  id: number;
  usuario_id: number;
  hq_id: number;
  status?: string;
  nota?: number;
  prioridade?: number;
  data_aquisicao?: Date;
  created_at?: Date;
  updated_at?: Date;
}