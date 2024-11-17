import axios from 'axios';
import OpenWeather_key, { WorldTime_key } from "../config/credentials.js";

export const getStatesByCountry = async (country) => {
  try {
    const apiUrl = 'https://countriesnow.space/api/v0.1/countries/states';

    // Raw body data to send with the POST request
    const requestBody = {
      country
    };

    // Send the POST request to the external API
    const response = await axios.post(apiUrl, requestBody, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Return the response data from the API
    return response.data;
  } catch (error) {
    console.error('Error in service:', error);
    throw new Error('Error calling the external API');
  }
};

export const getCitiesByState = async (country, state) => {
    try {
      const apiUrl = 'https://countriesnow.space/api/v0.1/countries/state/cities';
  
      // Raw body data to send with the POST request
      const requestBody = {
        country,
        state
      };
  
      // Send the POST request to the external API
      const response = await axios.post(apiUrl, requestBody, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      // Return the response data from the API
      return response.data;
    } catch (error) {
      console.error('Error in service:', error);
      throw new Error('Error calling the external API');
    }
  };

  export const getCoordinates = async (country, state, city) => {
    try {
      const apiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${state},${country}&limit=1&appid=${OpenWeather_key}`;
      
      // Correct the axios call, no need to destructure as an array
      const response = await axios.get(apiUrl, {
        headers: { 'Content-Type': 'application/json' }
      });
  
      // Return the response data (not `response.data` if you want only the results)
      return response.data; // The actual data returned by the API
    } catch (error) {
      throw new Error(`Error fetching coordinates from query: ${error.message}`);
    }
  };