export interface Usuario {
  id: number;
  nome: string;
  email: string;
  admin: boolean;
  quando_comecou?: string | null;
}

export interface LoginPayload {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
}

export interface CadastroPayload {
  nome: string;
  email: string;
  senha: string;
  quando_comecou?: string;
}
