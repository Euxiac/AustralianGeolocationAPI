const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const countries = sequelize.define('countries', {
    iso3: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    country_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    iso2: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = countries;