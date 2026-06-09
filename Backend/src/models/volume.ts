import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../database/index';
import { VolumeAttributes } from '../types/volume.types';

class Volume extends Model<VolumeAttributes> implements VolumeAttributes {
    id!: number;
    numero_volume!: number;
    titulo!: string;
    ano_publicacao!: number;

    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}

Volume.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    numero_volume: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    titulo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    ano_publicacao: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Volume',
    tableName: 'volume',
    timestamps: true,
    underscored: true,
});

export default Volume;