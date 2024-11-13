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