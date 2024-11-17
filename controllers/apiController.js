import * as apiService from '../services/apiService.js';

export const fetchStatesInCountry = async (req, res) => {
  try {
    const country = req.params.country;
    // Call the service method to interact with the external API
    const data = await apiService.getStatesByCountry(country);
    
    // Return the response from the service to the client
    res.json(data);
  } catch (error) {
    console.error('Error in controller:', error);
    res.status(500).send('Error communicating with external API');
  }
};

export const fetchCitiesInState = async (req, res) => {
  try {
    const country = req.params.country;
    const state = req.params.state;
    // Call the service method to interact with the external API
    const data = await apiService.getCitiesByState(country, state);
    
    // Return the response from the service to the client
    res.json(data);
  } catch (error) {
    console.error('Error in controller:', error);
    res.status(500).send('Error communicating with external API');
  }
};

export const fetchCoordinates = async (req, res) => {
  try {
    const country = req.params.country;
    const state = req.params.state;
    const city = req.params.city;
    const data = await apiService.getCoordinates(country, state, city);
    res.json({data});
  } catch (error) {
    res.status(500).json({message: `Error communicating with external API : ${error.message}`});
  }
};