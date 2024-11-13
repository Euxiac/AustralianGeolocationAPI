import sequelize from "../config/database.js";

export const postUpdateCoords = async (country, state, city, lat, lon) => {
    try {
      const [results] = await sequelize.query(`
        UPDATE cities ci JOIN states st
        ON ci.state_id = st.state_id
  
        JOIN countries co
        ON st.country = co.iso3

        SET 
        ci.lat = "${lat}", 
        ci.lon = "${lon}"
        WHERE 
        co.iso3 = "${country}"
        AND st.state_name = "${state}"
        AND ci.city_name = "${city}"
        ;
      `);
      return results;
    } catch (error) {
      throw new Error(
        `Error fetching test data: ${error.message}`
      );
    }
  };
