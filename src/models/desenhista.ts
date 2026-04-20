import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database/index";

interface DesenhistaAttributes {
    id: number;
    nome: string;
    created_at?: Date;
    updated_at?: Date;
}

class Desenhista extends Model<DesenhistaAttributes> implements DesenhistaAttributes {
    public id!: number;
    public nome!: string;
    public readonly created_at!: Date
    public readonly updated_at!: Date;
}

Desenhista.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: "Desenhista",
    tableName: "desenhista",
    timestamps: true,
    underscored: true,
})

export default Desenhista;