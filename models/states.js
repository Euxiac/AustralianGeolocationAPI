import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const states = sequelize.define('states', {
    state_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    state_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    country: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    state_code: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

export default states;