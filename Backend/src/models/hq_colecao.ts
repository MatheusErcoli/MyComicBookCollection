import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/index";
import { HQColecaoAttributes } from "../types/hq_colecao.types";

class HQColecao extends Model<HQColecaoAttributes> implements HQColecaoAttributes {
  public id!: number;
  public hq_id!: number;
  public colecao_id!: number;
  public ordem?: number;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

HQColecao.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    hq_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "hq",
        key: "id",
      },
    },
    colecao_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "colecao", 
        key: "id",
      },
    },
    ordem: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "HQColecao",
    tableName: "hq_colecao",
    timestamps: true,
    underscored: true,
  }
);

export default HQColecao ;