const axios = require("axios");
const ow_creds = `828619469cc259300802f375e9106b7b`;

export const getCoordinatesFromQuery = async () => {
  try {
    const [results] = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=Perth,036&limit=5&appid=${ow_creds}`);
    return results.data;
  } catch (error) {
    throw new Error(`Error fetching coordinates from query ${error.message}`);
  }
};