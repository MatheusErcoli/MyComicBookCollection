import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../database/index';
import { HQVolumeAttributes } from '../types/hq_volume.types';

class HQVolume extends Model<HQVolumeAttributes> implements HQVolumeAttributes {
    public id!: number;
    public hq_id!: number;
    public volume_id!: number;


    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}

HQVolume.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    hq_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'hq',
            key: 'id',
        },
    },
    volume_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'volume',
            key: 'id',
        },
    }
}, {
        sequelize,
        modelName: 'HQVolume',
        tableName: 'hq_volume',
        timestamps: true,
        underscored: true,
    }
);

export default HQVolume;