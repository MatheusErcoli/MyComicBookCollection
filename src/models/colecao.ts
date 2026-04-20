import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database/index";

interface ColecaoAttributes {
    id: number;
    nome: string;
    descricao: Text;
    ano_publicacao: number;
    qtd_volumes: number;
    created_at?: Date;
    updated_at?: Date;
}

class Colecao extends Model<ColecaoAttributes> implements ColecaoAttributes {
    public id!: number;
    public nome!: string;
    public descricao!: Text;
    public ano_publicacao!: number;
    public qtd_volumes!: number;
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}

Colecao.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    descricao: {
        type: DataTypes.TEXT,
    },
    ano_publicacao: {
        type: DataTypes.INTEGER,
    },
    qtd_volumes: {
        type: DataTypes.INTEGER,
    },
}, {
    sequelize,
    modelName: "Colecao",
    tableName: "colecao",
    timestamps: true,
    underscored: true,
})

export default Colecao;