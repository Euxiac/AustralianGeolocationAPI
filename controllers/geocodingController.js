import {getTest} from '../services/geocodingService.js';

  export const fetchTest = async (req, res) => {
    try {
      const data = await getTest();
      res.json({data});
    } catch (error) {
      res.status(500).json({message: `test ${error.message}`});
    }
  };