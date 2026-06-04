import { Optional } from "sequelize";

export interface UsuarioAttributes {
  id?: number;
  nome: string;
  email: string;
  senha: string;
  quando_comecou: Date | null;
  admin: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export type UsuarioCreationAttributes = Optional<UsuarioAttributes, "id" | "admin" | "created_at" | "updated_at" | "quando_comecou">;
