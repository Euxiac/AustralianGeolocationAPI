import * as databaseService from '../services/databaseService.js';

export const updateCoords = async (req, res) => {
    try {
      const country = req.params.country;
        const state = req.params.state;
        const city = req.params.city;
        const lat = parseFloat(req.params.lat);
        const lon = parseFloat(req.params.lon);
      const data = await databaseService.postUpdateCoords(country, state, city, lat, lon);
      res.json({data});
    } catch (error) {
      res.status(500).json({message: `test ${error.message}`});
    }
  };

  export const deleteCity = async (req, res) => {
    try {
      const country = req.params.country;
        const state = req.params.state;
        const city = req.params.city;
      const data = await databaseService.postDeleteCity(country, state, city);
      res.json({data});
    } catch (error) {
      res.status(500).json({message: `test ${error.message}`});
    }
  };

  export const emptyTables = async (req, res) => {
    try {
      const data = await databaseService.postEmpty();
      res.json({data});
    } catch (error) {
      res.status(500).json({message: `test ${error.message}`});
    }
  };

  export const redrawTables = async (req, res) => {
    try {
      const data = await databaseService.postRedraw();
      res.json({data});
    } catch (error) {
      res.status(500).json({message: `test ${error.message}`});
    }
  };

  export const populateWithMockData = async (req, res) => {
    try {
      const data = await databaseService.postPopulateWithMockData();
      res.json({data});
    } catch (error) {
      res.status(500).json({message: `test ${error.message}`});
    }
  };

  
  export const populate = async (req, res) => {
    try {
      const data = await databaseService.postPopulate();
      res.json({data});
    } catch (error) {
      res.status(500).json({message: `test ${error.message}`});
    }
  };