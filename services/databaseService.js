import sequelize from "../config/database.js";
import axios from 'axios';

export const postUpdateCoords = async (country, state, city, lat, lon) => {
  try {
    const [results] = await sequelize.query(`
        UPDATE cities ci JOIN states st
        ON ci.state_id = st.state_id
  
        JOIN countries co
        ON st.country = co.iso3

        SET 
        ci.lat = "${lat}", 
        ci.lon = "${lon}"
        WHERE 
        co.iso3 = "${country}"
        AND st.state_name = "${state}"
        AND ci.city_name = "${city}"
        ;
      `);
    return results;
  } catch (error) {
    throw new Error(`Error fetching test data: ${error.message}`);
  }
};

export const postDeleteCity = async (country, state, city) => {
  try {
    const [results] = await sequelize.query(`
        DELETE ci
        FROM cities ci

        JOIN states st
        ON ci.state_id = st.state_id

        JOIN countries co
        ON st.country = co.iso3

        WHERE 
        co.iso3 = "${country}"
        AND st.state_name = "${state}"
        AND ci.city_name = "${city}";
      `);
    return results;
  } catch (error) {
    throw new Error(`Error fetching test data: ${error.message}`);
  }
};

export const postRedraw = async () => {
  try {
    // First, drop the existing tables
    await sequelize.query(`
      DROP TABLE IF EXISTS cities, states, countries;
    `);

    // Now, create the tables
    await sequelize.query(`
      CREATE TABLE countries (
        iso3 VARCHAR(3) PRIMARY KEY,
        iso2 VARCHAR(2),
        country_name VARCHAR(255),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    await sequelize.query(`
      CREATE TABLE states (
        state_id INT AUTO_INCREMENT PRIMARY KEY,
        state_name VARCHAR(255),
        country VARCHAR(3),
        FOREIGN KEY (country) REFERENCES countries(iso3),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    await sequelize.query(`
      CREATE TABLE cities (
        city_id INT AUTO_INCREMENT PRIMARY KEY,
        city_name VARCHAR(255),
        state_id INT,
        FOREIGN KEY (state_id) REFERENCES states(state_id),
        lat DECIMAL(10,7),
        lon DECIMAL(10,7),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    return "Tables created successfully!";
  } catch (error) {
    throw new Error(`Error creating tables: ${error.message}`);
  }
};

export const postEmpty = async () => {
  try {
    await sequelize.query(`
        DELETE FROM cities;
      `);

      await sequelize.query(`
        DELETE FROM states;
      `);

      await sequelize.query(`
        DELETE FROM countries;
      `);
    return "Tables emptied";
  } catch (error) {
    throw new Error(`Error fetching test data: ${error.message}`);
  }
};

export const postPopulateWithMockData = async () => {
  try {
    // Insert countries
    await sequelize.query(`
      INSERT INTO countries (iso3, iso2, country_name)
      VALUES
        ('aus', 'au', 'australia'),
        ('idn', 'id', 'indonesia');
    `);

    // Insert states
    await sequelize.query(`
      INSERT INTO states (state_name, country)
      VALUES
        ('australian capital territory', 'aus'),
        ('western australia', 'aus'),
        ('northern territory', 'aus'),
        ('south australia', 'aus'),
        ('queensland', 'aus'),
        ('new south wales', 'aus'),
        ('victoria', 'aus'),
        ('tasmania', 'aus'),
        ('east java', 'idn');
    `);

    // Insert cities
    await sequelize.query(`
      INSERT INTO geolocation_database.cities (city_name, state_id, lat, lon)
        VALUES
          ('perth', 2, -31.9558933, 115.8605855),
          ('albany', 2, -35.022778, 117.881386),
          ('canberra', 1, -35.2975906, 149.1012676),
          ('melbourne', 7, NULL, NULL),
          ('surabaya', 9, -7.250445, 112.768845);
    `);

    return "Populated mock data successfully!";
  } catch (error) {
    throw new Error(`Error creating tables: ${error.message}`);
  }
};

export const postPopulate = async () => {
  try {
    

    return "Populated data successfully!";
  } catch (error) {
    throw new Error(`Error creating tables: ${error.message}`);
  }
};
