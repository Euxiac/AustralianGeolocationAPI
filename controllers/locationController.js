import * as locationService from '../services/locationService.js';

  export const fetchAllCountries = async (req, res) => {
    try {
      const data = await locationService.getAllCountries();
      res.json({data});
    } catch (error) {
      res.status(500).json({message: `test ${error.message}`});
    }
  };

  export const fetchAllStates = async (req, res) => {
    try {
      const data = await locationService.getAllStates();
      res.json({data});
    } catch (error) {
      res.status(500).json({message: `test ${error.message}`});
    }
  };

  export const fetchAllCities = async (req, res) => {
    try {
      const data = await locationService.getAllCities();
      res.json({data});
    } catch (error) {
      res.status(500).json({message: `test ${error.message}`});
    }
  };

  export const fetchFromQuery = async (req, res) => {
    try {
      const country = req.params.country;
        const state = req.params.state;
        const city = req.params.city;
      const data = await locationService.getFromQuery(country, state, city);
      res.json({data});
    } catch (error) {
      res.status(500).json({message: `test ${error.message}`});
    }
  };