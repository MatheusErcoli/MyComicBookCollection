import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database/index";

interface EditoraAttributes {
    id: number;
    nome: string;
    created_at?: Date;
    updated_at?: Date;
}

class Editora extends Model<EditoraAttributes> implements EditoraAttributes {
    public id!: number;
    public nome!: string
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}

Editora.init({
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
    modelName: "Editora",
    tableName: "editora",
    timestamps: true,
    underscored: true,
})

export default Editora;