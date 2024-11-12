const geocodingService = require('../services/geocodingService')

export const fetchCoordinatesFromQuery = async (req, res) => {
    try {
      const coordinates = await getCoordinatesFromQuery(); 
      res.json({coordinates});
    } catch (error) {
      res.status(500).json({message: `test ${error.message}` });
    }
  };