import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database/index";

interface AutorAttributes {
    id: number;
    nome: string;
    created_at?: Date;
    updated_at?: Date;
}

class Autor extends Model<AutorAttributes> implements AutorAttributes {
    public id!: number;
    public nome!: string;
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}

Autor.init({
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
    modelName: "Autor",
    tableName: "autor",
    timestamps: true,
    underscored: true,
})

export default Autor;