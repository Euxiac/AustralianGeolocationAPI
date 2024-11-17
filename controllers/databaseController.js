import * as databaseService from "../services/databaseService.js";
import * as apiController from "../controllers/apiController.js";
import * as apiService from "../services/apiService.js";
import countries from "../models/countries.js";
import states from "../models/states.js";
import cities from "../models/cities.js";

export const updateCoords = async (req, res) => {
  try {
    const country = req.params.country;
    const state = req.params.state;
    const city = req.params.city;
    const lat = parseFloat(req.params.lat);
    const lon = parseFloat(req.params.lon);
    const data = await databaseService.postUpdateCoords(
      country,
      state,
      city,
      lat,
      lon
    );
    //res.json({ data });
  } catch (error) {
    res.status(500).json({ message: `test ${error.message}` });
  }
};

export const deleteCity = async (req, res) => {
  try {
    const country = req.params.country;
    const state = req.params.state;
    const city = req.params.city;
    const data = await databaseService.postDeleteCity(country, state, city);
    //res.json({ data });
  } catch (error) {
    res.status(500).json({ message: `test ${error.message}` });
  }
};

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
    const data = await databaseService.postPopulate();
    //res.json({ data });
  } catch (error) {
    res.status(500).json({ message: `test ${error.message}` });
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
    const table = req.params.table; // The table name from URL parameter
    const bodyParams = req.body; // The body parameters

    // Validate input
    if (!bodyParams) {
      return res.status(400).json({ message: "Body parameters are invalid" });
    }

    let result = null;

    // Decide which service to run based on the table name
    switch (table) {
      case "country":
        result = await databaseService.addCountryService(bodyParams);
        break;

      case "state":
        result = await databaseService.addStateService(bodyParams);
        break;

      case "city":
        result = await databaseService.addCityService(bodyParams);
        break;

      default:
        return res
          .status(400)
          .json({ message: `Invalid table name: ${table}` });
    }

    // Handle response based on result
    if (result && result.success) {
      return res.status(200).json({
        message: `${table} added successfully`,
        data: result.data,
      });
    } else {
      // Handle failure
      return res.status(500).json({
        message: result?.message || `Failed to add ${table}`,
      });
    }
  } catch (error) {
    console.error("Error in addEntry controller:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
