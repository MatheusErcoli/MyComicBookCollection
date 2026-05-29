import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database/index";
import { HQAutorAttributes } from "../types/hq_autor.types";

class HQAutor extends Model<HQAutorAttributes> implements HQAutorAttributes {
    public id!: number;
    public hq_id!: number;
    public autor_id!: number;
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}

HQAutor.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    hq_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "HQ",
            key: "id",
        },
    },
    autor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Autor",
            key: "id",
        },
    },
}, {
    sequelize,
    modelName: "HQAutor",
    tableName: "hq_autor",
    timestamps: true,
    underscored: true,
});

export default HQAutor;