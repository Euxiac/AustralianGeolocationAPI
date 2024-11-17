import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const cities = sequelize.define('cities', {
    city_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        primaryKey: true
    },
    city_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    state_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    lat: {
        type: DataTypes.DECIMAL,
        allowNull: true,
    },
    lon: {
        type: DataTypes.DECIMAL,
        allowNull: true,
    },
});

export default cities;