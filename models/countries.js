import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

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

export default countries;