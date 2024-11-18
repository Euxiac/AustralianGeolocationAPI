import * as databaseService from "../services/databaseService.js";
import countries from "../models/countries.js";
import states from "../models/states.js";
import cities from "../models/cities.js";
import axios from "axios";
// TABLES -------------------------------------------------------------------------

export const emptyTables = async (req, res) => {
  try {
    const data = await databaseService.postEmpty();
    //res.json({ data });
  } catch (error) {
    res.status(500).json({ message: `test ${error.message}` });
  }
};

export const redrawTables = async (req, res) => {
  try {
    console.log("REDRAWING TABLES-----------------------");
    const data = await databaseService.postRedraw();
    //res.json({ data });
    console.log("TABLES REDRAWN-----------------------");
  } catch (error) {
    res.status(500).json({ message: `test ${error.message}` });
  }
};

export const populateWithMockData = async (req, res) => {
  try {
    const data = await databaseService.postPopulateWithMockData();
    //res.json({ data });
  } catch (error) {
    res.status(500).json({ message: `test ${error.message}` });
  }
};

export const populateFromAPI = async (req, res) => {
  try {
    // Step 1: Fetch the states from the external API by calling the /fetchStatesInCountry route
    const supportedCountries = ['australia','singapore'];
    let countryData = [];
    let stateData = [];
    let cityData = [];

    // Loop through the supported countries and fetch country data
    for (let i = 0; i < supportedCountries.length; i++) {
      const apiURL= `http://localhost:8000/api/fetch-states/${supportedCountries[i]}`;
      const apiResponse = await axios.post(apiURL);
      countryData.push(apiResponse.data);
    }
    
    // Step 2.A: Prepare the data for insertion into the database
    const countryPromises = countryData.map(async (data) => {
      // Prepare requestBody for adding country to the database
      const requestBody = {
        'iso3': data.data.iso3.toLowerCase(),
        'iso2': data.data.iso2.toLowerCase(),
        'country_name': data.data.name.toLowerCase(),
      };

      // URL for adding the country
      const addCountryURL = `http://localhost:8000/database/entries/add-country`;
      try {
        // Send the request to add country
        const response = await axios.post(addCountryURL, requestBody);
        console.log(`Successfully added country: ${data.data.name}`);
        return response.data; // return the response or data you need
      } catch (error) {
        console.error(`Error adding country: ${data.data.name}`, error.message);
        return null; // Handle error and return null or an error message
      }
    });
    
    // Loop through the countrydata and seperate states data in one [] per country
    for (let c = 0; c < countryData.length; c++) {
      for (let s = 0; s < countryData[c].data.states.length; s++) {
        countryData[c].data.states[s]['iso3'] = countryData[c].data.iso3;
        stateData.push(countryData[c].data.states[s]);
      }
    }

     // Step 2.A: Prepare the data for insertion into the database
     const statePromises = stateData.map(async (data) => {
      // Prepare requestBody for adding country to the database
      const requestBody = {
        "state_name": data.name.toLowerCase(),
        "country": data.iso3.toLowerCase()
      };

      // URL for adding the country
      const addCountryURL = `http://localhost:8000/database/entries/add-state`;
      try {
        // Send the request to add country
        const response = await axios.post(addCountryURL, requestBody);
        console.log(`Successfully added country: ${data.name}`);
        return response.data; // return the response or data you need
      } catch (error) {
        console.error(`Error adding country: ${data.name}`, error.message);
        return null; // Handle error and return null or an error message
      }
    });

    // Loop through the states in stateData and fetch city data
    for (let i = 0; i < stateData.length; i++) {
      const apiURL= `http://localhost:8000/api/fetch-cities/${stateData[i].iso3}/${stateData[i].name}`;
      const apiResponse = await axios.post(apiURL);
      cityData.push(apiResponse.data);
    }

    // Wait for all the requests to finish
    const results = await Promise.all(countryPromises, statePromises);

      res.json({ message: 'Countries populated successfully', results , countryData, stateData, cityData });
  } catch (error) {
    res.status(500).json({ message: `error ${error.message}` });
  }
};

export const areTablesEmpty = async (req, res) => {
  try {
    console.log("CHECKING TABLES ARE EMPTY-----------------------");
    const countriesIsEmpty = (await countries.count()) === 0;
    const statesIsEmpty = (await states.count()) === 0;
    const citiesIsEmpty = (await cities.count()) === 0;

    if (countriesIsEmpty & statesIsEmpty & citiesIsEmpty) {
      console.log("tables empty");
      return true;
    } else {
      console.log("tables not empty");
      return false;
    }
    // Send the response as a boolean
    //res.json({ countriesIsEmpty, statesIsEmpty, citiesIsEmpty });
    console.log("CHECKED TABLES ARE EMPTY-----------------------");
  } catch (error) {
    console.error("Error checking if tables are empty:", error);
    res.status(500).json({ message: "Error checking if tables are empty" });
  }
};

export const redrawTablesWithData = async (req, res) => {
  try {
    console.log("=== SEQUENCE START ==-----------------------");
    const dataset = req.params.dataset;

    // Redraw tables first
    await redrawTables(req, res);

    // Check if tables are empty
    const tablesEmpty = await areTablesEmpty(req, res);

    let response = "";

    if (tablesEmpty) {
      // Use a switch statement to handle different 'dataset' values
      switch (dataset) {
        case "empty":
          response = "Tables have not been filled";
          break;

        case "mock":
          await populateWithMockData(req, res);
          response = "Tables filled with mock data";
          break;

        case "true":
          await populateFromAPI(req, res);
          response = "Tables filled with data from API";
          break;

        default:
          response = "Invalid data value";
          break;
      }

      // Send the response after the switch statement
      return res.send(response);
    } else {
      // If tables are not empty, return this response
      return res.send("Tables are already filled");
    }
    console.log("=== SEQUENCE END ==-----------------------");
  } catch (error) {
    console.error("Error redraw tables with data:", error);
    return res.status(500).json({ message: "Error redraw tables with data" });
  }
};

// ENTRIES -------------------------------------------------------------------------
export const addEntry = async (req, res) => {
  try {
    const { table } = req.params; // Get the entity type (country, state, city)
    const bodyParams = req.body; // The data to be added

    if (!bodyParams) {
      return res.status(400).json({ message: "Body parameters are invalid" });
    }

    let result;
    if (table === "city") {
      result = await databaseService.CityEntryService(table, bodyParams, "add");
    } else {
      // Call the generalized service for adding entries
      result = await databaseService.addEntryService(table, bodyParams);
    }

    if (result.success) {
      return res.status(200).json({
        message: `${
          table.charAt(0).toUpperCase() + table.slice(1)
        } added successfully`,
        data: result.data,
      });
    } else {
      return res
        .status(500)
        .json({ message: result.message || `Failed to add ${table}` });
    }
  } catch (error) {
    console.error("Error in addEntry controller:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateEntry = async (req, res) => {
  try {
    const { table } = req.params; // Get the entity type (country, state, city)
    const bodyParams = req.body; // The data to be added

    if (!bodyParams) {
      return res.status(400).json({ message: "Body parameters are invalid" });
    }

    let result;
    if (table === "city") {
      result = await databaseService.CityEntryService(
        table,
        bodyParams,
        "update"
      );
    } else {
      // Call the generalized service for adding entries
      result = await databaseService.updateEntryService(table, bodyParams);
    }

    if (result.success) {
      return res.status(200).json({
        message: `${
          table.charAt(0).toUpperCase() + table.slice(1)
        } updated successfully`,
        data: result.data,
      });
    } else {
      return res
        .status(500)
        .json({ message: result.message || `Failed to update ${table}` });
    }
  } catch (error) {
    console.error("Error in updateEntry controller:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteEntry = async (req, res) => {
  try {
    const { table } = req.params; // Get the entity type (country, state, city)
    const bodyParams = req.body; // The data to be added

    if (!bodyParams) {
      return res.status(400).json({ message: "Body parameters are invalid" });
    }

    let result;
    if (table === "city") {
      result = await databaseService.CityEntryService(
        table,
        bodyParams,
        "delete"
      );
    } else {
      // Call the generalized service for adding entries
      result = await databaseService.deleteEntryService(table, bodyParams);
    }

    if (result.success) {
      return res.status(200).json({
        message: `${
          table.charAt(0).toUpperCase() + table.slice(1)
        } deleted successfully`,
        data: result.data,
      });
    } else {
      return res
        .status(500)
        .json({ message: result.message || `Failed to delete ${table}` });
    }
  } catch (error) {
    console.error("Error in deleteEntry controller:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
