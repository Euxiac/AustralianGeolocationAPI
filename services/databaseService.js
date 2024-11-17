import sequelize from "../config/database.js";
import axios from "axios";
import countries from "../models/countries.js";
import states from "../models/states.js";
import cities from "../models/cities.js";

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

const checkEntryExists = async (model, uniqueFields, data) => {
  const query = uniqueFields.reduce((acc, field) => {
    acc[field] = data[field];
    return acc;
  }, {});
  const existingEntry = await model.findOne({ where: query });
  return existingEntry;
};

export const addEntryService = async (entity, data) => {
  try {
    let model;
    let uniqueFields;
    let createData;
    let state_id;

    switch (entity) {
      case "country":
        model = countries;
        uniqueFields = ["iso3", "iso2", "country_name"];
        createData = {
          iso3: data.iso3,
          iso2: data.iso2,
          country_name: data.country_name,
        };

        // Check if country already exists
        const existingCountry = await checkEntryExists(model, uniqueFields, data);
        if (existingCountry) {
          return { success: false, message: "Country already exists" };
        }
        break;

      case "state":
        model = states;
        uniqueFields = ["state_name", "country"];
        createData = {
          state_name: data.state_name,
          country: data.country,
        };

        // Check if state already exists
        const existingState = await checkEntryExists(model, uniqueFields, data);
        if (existingState) {
          return { success: false, message: "State already exists" };
        }
        break;

      case "city":
        model = cities;
        uniqueFields = ["city_name", "state_id"];

        // Ensure country_iso3 and state_name are passed in
        if (!data.country_iso3 || !data.state_name) {
          return { success: false, message: "Country ISO3 or State Name is missing" };
        }

        // Find the state ID for the city
        const stateQuery = await states.findOne({
          where: { country: data.country_iso3, state_name: data.state_name },
        });

        // Handle case where state is not found
        if (!stateQuery) {
          return { success: false, message: "State not found for the given country" };
        }

        state_id = stateQuery.state_id;

        // Check if the city already exists using the state_id
        const existingCity = await checkEntryExists(model, uniqueFields, { ...data, state_id });
        if (existingCity) {
          return { success: false, message: "City already exists" };
        }

        createData = {
          city_name: data.city_name,
          state_id: state_id,
          lat: data.lat,
          lon: data.lon,
        };
        break;

      default:
        return { success: false, message: `Invalid entity: ${entity}` };
    }

    // Create the new entry
    const newEntry = await model.create(createData);

    return { success: true, data: newEntry };
  } catch (error) {
    console.error(`Error in addEntryService for ${entity}:`, error);
    return { success: false, error: error.message };
  }
};

export const deleteEntryService = async (entity, data) => {
  try {
    let result;

    let model;
    let uniqueFields;
    let entityData;
    let state_id;
    let query;

    switch (entity) {
      case "country":
        model = countries;
        uniqueFields = ["iso3", "iso2", "country_name"];
        entityData = {
          iso3: data.iso3,
          iso2: data.iso2,
          country_name: data.country_name,
        };
        query = `
        DELETE co
        FROM countries co

        WHERE 
        co.iso3 = "${entityData.iso3}"
        AND co.country_name = "${entityData.country_name}"
        `;
        // Check if state already exists
        const existingState = await checkEntryExists(model, uniqueFields, data);
        if (existingState) {
          return { success: false, message: "State already exists" };
        }
        break;

      case "state":
        model = states;
        uniqueFields = ["state_name", "country"];
        entityData = {
          state_name: data.state_name,
          country: data.country,
        };
        query = `
        DELETE st
        FROM states st

        WHERE 
        st.state_name = "${entityData.state_name}"
        AND st.country = "${entityData.country}"
        `;
        
        break;

      case "city":
        model = cities;
        uniqueFields = ["city_name", "state_id"];

        // Ensure country_iso3 and state_name are passed in
        if (!data.country_iso3 || !data.state_name) {
          return {
            success: false,
            message: "Country ISO3 or State Name is missing",
          };
        }

        // Find the state ID for the city
        const stateQuery = await states.findOne({
          where: { country: data.country_iso3, state_name: data.state_name },
        });

        // Handle case where state is not found
        if (!stateQuery) {
          return {
            success: false,
            message: "State not found for the given country",
          };
        }

        state_id = stateQuery.state_id

        // Check if the city already exists using the state_id
        const existingCity = await checkEntryExists(model, uniqueFields, { ...data, state_id });
        if (!existingCity) {
          return { success: false, message: "City doesn't exists" };
        }

        entityData = {
          city_name: data.city_name,
          state_id: state_id,
          lat: data.lat,
          lon: data.lon,
        };

        query = `
        DELETE ci
        FROM cities ci

        JOIN states st
        ON ci.state_id = st.state_id

        JOIN countries co
        ON st.country = co.iso3

        WHERE 
        co.iso3 = "${data.country_iso3}"
        AND st.state_name = "${data.state_name}"
        AND ci.city_name = "${entityData.city_name}";
        `;

        break;

      default:
        return { success: false, message: `Invalid entity: ${entity}` };
    }

    //delete
    const [results] = await sequelize.query(query);

    return { success: true , results: results};
  } catch (error) {
    console.error(`Error in deleteEntryService for ${entity}:`, error);
    return { success: false, error: error.message };
  }
};
