import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/index";
import {
  HQUsuarioAttributes,
  HQUsuarioCreationAttributes
} from "../types/hq_usuario.types";

class HQUsuario
  extends Model<HQUsuarioAttributes, HQUsuarioCreationAttributes>
  implements HQUsuarioAttributes
{
  public id!: number;
  public usuario_id!: number;
  public hq_id!: number;
  public status?: string;
  public nota?: number;
  public prioridade?: number;
  public data_aquisicao?: Date;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

HQUsuario.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "usuario",
        key: "id",
      },
    },
    hq_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "hq",
        key: "id",
      },
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nota: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    prioridade: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    data_aquisicao: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "HQUsuario",
    tableName: "hq_usuario",
    timestamps: true,
    underscored: true,
  }
);

export default HQUsuario;