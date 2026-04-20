import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database/index";

interface UsuarioAttributes {
    id: number;
    nome: string;
    email: string;
    senha: string;
    created_at?: Date;
    updated_at?: Date;
}

class Usuario extends Model<UsuarioAttributes> implements UsuarioAttributes {
    public id!: number;
    public nome!: string;
    public email!: string;
    public senha!: string;
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}

Usuario.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: "Usuario",
    timestamps: true,
    underscored: true,
})