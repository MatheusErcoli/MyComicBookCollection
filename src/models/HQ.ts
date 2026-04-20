import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database/index";

interface HQAttributes {
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
  editora_id?: number;
  created_at?: Date;
  updated_at?: Date;
}

class HQ extends Model<HQAttributes> implements HQAttributes {
  public id!: number;
  public titulo!: string;
  public descricao?: string;
  public data_publicacao?: Date;
  public numero_edicao?: number;
  public capa_url?: string;
  public valor?: number;
  public valor_pago?: number;
  public formato?: string;
  public quantidade_paginas?: number;
  public editora_id?: number;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

HQ.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  titulo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descricao: {
      type: DataTypes.TEXT,
    },
    data_publicacao: {
      type: DataTypes.DATEONLY,
    },
    numero_edicao: {
      type: DataTypes.INTEGER,
    },
    capa_url: {
      type: DataTypes.STRING,
    },
    valor: {
      type: DataTypes.DECIMAL(10, 2),
    },
    valor_pago: {
      type: DataTypes.DECIMAL(10, 2),
    },
    formato: {
      type: DataTypes.STRING,
    },
    quantidade_paginas: {
      type: DataTypes.INTEGER,
    },
    editora_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
},
{
    sequelize,
    modelName: "HQ",
    timestamps: true,
    underscored: true,
}
);
