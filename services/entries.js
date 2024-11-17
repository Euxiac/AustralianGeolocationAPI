import sequelize from "../config/database.js";
import axios from "axios";
import countries from "../models/countries.js";
import states from "../models/states.js";
import cities from "../models/cities.js";

const checkEntryExists = async (model, uniqueFields, data) => {
  const query = uniqueFields.reduce((acc, field) => {
    acc[field] = data[field];
    return acc;
  }, {});
  const existingEntry = await model.findOne({ where: query });
  return existingEntry;
};

const getModelAndQueryData = async (entity, data) => {
  let model;
  let uniqueFields;
  let createData;
  let query;

  switch (entity) {
    case "country":
      model = countries;
      uniqueFields = ["iso3", "iso2", "country_name"];
      createData = {
        iso3: data.iso3,
        iso2: data.iso2,
        country_name: data.country_name,
      };
      break;

    case "state":
      model = states;
      uniqueFields = ["state_name", "country"];
      createData = {
        state_name: data.state_name,
        country: data.country,
      };
      break;

    case "city":
      model = cities;
      uniqueFields = ["city_name", "state_id"];

      if (!data.country_iso3 || !data.state_name) {
        return { error: "Country ISO3 or State Name is missing" };
      }

    
      // Find the state ID for the city
      const stateQuery = await states.findOne({
        where: { country: data.country_iso3, state_name: data.state_name },
      });

      // Handle case where state is not found
      if (!stateQuery) {
        return { error: "State not found for the given country" };
      }

      const state_id = stateQuery.state_id;
      console.log


      createData = {
        city_name: data.city_name,
        state_id: state_id,
        lat: data.lat,
        lon: data.lon,
      };
      break;

    default:
      return { error: `Invalid entity: ${entity}` };
  }

  return { model, uniqueFields, createData, query: query };
};

export const addEntryService = async (entity, data) => {
  try {
    // Get model, unique fields, and data for insertion
    let { model, uniqueFields, createData, error } = await getModelAndQueryData(entity, data);
    
    if (error) {
      return { success: false, message: error };
    }

    // For city, check if state_id is set correctly
    if (entity === "city" && !state_id) {
      return { success: false, message: "State ID could not be determined" };
    }
    // Check if the entry already exists
    const existingEntry = await checkEntryExists(model, uniqueFields, data);
    if (existingEntry) {
      return { success: false, message: `${entity.charAt(0).toUpperCase() + entity.slice(1)} already exists` };
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
    // Get model, unique fields, and query for deletion
   let { model, uniqueFields, query, error } = await getModelAndQueryData(entity, data);

    if (error) {
      return { success: false, message: error };
    }

    // Construct the query for deletion
    switch (entity) {
      case "country":
        query = `
          DELETE FROM countries
          WHERE iso3 = "${data.iso3}" AND country_name = "${data.country_name}";
        `;
        break;

      case "state":
        query = `
          DELETE FROM states
          WHERE state_name = "${data.state_name}" AND country = "${data.country}";
        `;
        break;

      case "city":
        // Ensure country_iso3 and state_name are passed in
        if (!data.country_iso3 || !data.state_name) {
          return { success: false, message: "Country ISO3 or State Name is missing" };
        }

        query = `
          DELETE FROM cities
          WHERE city_name = "${data.city_name}" AND state_id = "${entity.state_id}";
        `;
        break;

      default:
        return { success: false, message: `Invalid entity: ${entity}` };
    }

    // Check if the entry already exists
    const existingEntry = await checkEntryExists(model, uniqueFields, data);
    if (existingEntry) {
      // Run the delete query
      const [results] = await sequelize.query(query);
      return { success: true, results: results };
    }
    else {
      return { success: false, message: `${entity.charAt(0).toUpperCase() + entity.slice(1)} doesn't exist` };
    }
  } catch (error) {
    console.error(`Error in deleteEntryService for ${entity}:`, error);
    return { success: false, error: error.message };
  }
};