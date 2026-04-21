import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/index";
import { HQDesenhistaAttributes } from "../types/hq_desenhista.types";

class HQDesenhista extends Model<HQDesenhistaAttributes> implements HQDesenhistaAttributes {
  public id!: number;
  public hq_id!: number;
  public desenhista_id!: number;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

HQDesenhista.init(
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
    desenhista_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "desenhista", 
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "HQDesenhista",
    tableName: "hq_desenhista",
    timestamps: true,
    underscored: true,
  }
);

export default HQDesenhista ;