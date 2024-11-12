const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const cities = sequelize.define('cities', {
    city_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
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

module.exports = cities;