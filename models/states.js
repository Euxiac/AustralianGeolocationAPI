import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const states = sequelize.define('states', {
    state_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        primaryKey: true
    },
    state_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    country: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

export default states;