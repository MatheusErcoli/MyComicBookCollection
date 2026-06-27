import { api } from "./api";
import { clearAuthData, setAuthData } from "./auth-storage";
import {
  CadastroPayload,
  LoginPayload,
  LoginResponse,
  Usuario,
} from "../types/usuario.types";

export async function login(payload: LoginPayload) {
  const { data } = await api.post<LoginResponse>("/login", payload);

  setAuthData(data.token, data.usuario);

  return data;
}

export async function cadastrarUsuario(payload: CadastroPayload) {
  const { data } = await api.post<Usuario>("/usuario", payload);

  return data;
}

export function logout() {
  clearAuthData();
}
