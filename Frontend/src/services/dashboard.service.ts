import { api } from "./api";
import { DashboardResumo } from "../types/dashboard.types";

export async function buscarResumoDashboard() {
  const { data } = await api.get<DashboardResumo>("/dashboard");

  return data;
}
