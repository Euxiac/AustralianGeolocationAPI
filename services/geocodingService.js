import OpenWeather_key, { WorldTime_key } from "../config/credentials.js";
import sequelize from "../config/database.js";
import axios from 'axios';

const useCredentials = false;
const openWeather_key = () => {
  return useCredentials ? OpenWeather_key : "null";
};

const mockLocation = { lat: -31.9558933, lon: 115.8605855 };

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

export const getTest = async () => {
  try {
    const [results] = await sequelize.query(`
      SELECT ci.city_name, 
      st.state_name, 
      co.country_name,
      co.iso3, 
      ci.lat, 
      ci.lon

      FROM cities ci

      JOIN states st
      ON ci.state_id = st.state_id

      JOIN countries co
      ON st.country = co.iso3

      WHERE 
	    ci.city_name = "perth"  
      AND st.state_name = "western australia"
      AND co.iso3 = "aus"
    `);
    return results;
  } catch (error) {
    throw new Error(
      `Error fetching test data: ${error.message}`
    );
  }
};
