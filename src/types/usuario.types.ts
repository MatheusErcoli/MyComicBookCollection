import { Optional } from "sequelize";

export interface UsuarioAttributes {
  id?: number;
  nome: string;
  email: string;
  senha: string;
  created_at?: Date;
  updated_at?: Date;
}

export type UsuarioCreationAttributes = Optional<UsuarioAttributes, 'id' | 'created_at' | 'updated_at'>;
