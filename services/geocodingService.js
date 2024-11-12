import OpenWeather_key, { WorldTime_key } from "./credentials";
const axios = require("axios");
const ow_creds = `828619469cc259300802f375e9106b7b`;

const useCredentials = false;
const openWeather_key = () => {
  return useCredentials ? OpenWeather_key : "null";
};
const worldTime_key = () => {
  return useCredentials ? WorldTime_key : "null";
};

// {} => destructuring, when you have an object and just want one thing out of that object
const location = { lat: -31.9558933, lon: 115.8605855 };

export const getCoordinatesFromQuery = async () => {
  try {
    const [results] = await axios.get(
      `http://api.openweathermap.org/geo/1.0/direct?q=Perth,036&limit=5&appid=${openWeather_key()}`
    );
    return results.data;
  } catch (error) {
    throw new Error(`Error fetching coordinates from query ${error.message}`);
  }
};
