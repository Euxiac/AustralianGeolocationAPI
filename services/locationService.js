import sequelize from "../config/database.js";

export const getAllCountries = async () => {
    try {
      const [results] = await sequelize.query(`
        SELECT * FROM geolocation_database.countries;
      `);
      return results;
    } catch (error) {
      throw new Error(
        `Error fetching test data: ${error.message}`
      );
    }
  };

  export const getAllStates = async () => {
    try {
      const [results] = await sequelize.query(`
        SELECT * FROM geolocation_database.states;
      `);
      return results;
    } catch (error) {
      throw new Error(
        `Error fetching test data: ${error.message}`
      );
    }
  };

  export const getAllCities = async () => {
    try {
      const [results] = await sequelize.query(`
        SELECT * FROM geolocation_database.cities;
      `);
      return results;
    } catch (error) {
      throw new Error(
        `Error fetching test data: ${error.message}`
      );
    }
  };

  export const getFromQuery = async (country, state, city) => {
    try {
        if (country===null || state===null || city===null){
                return results.state(400).send('missing parameters');
        }
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
        ci.city_name = "${city}"  
        AND st.state_name = "${state}"
        AND co.iso3 = "${country}"
      `);;
      
      return results;
    } catch (error) {
      throw new Error(
        `Error fetching test data: ${error.message}`
      );
    }
  };

  export const convertCountry = async (operation, query) => {
    try {
      console.log("run");
      console.log(operation, query);
      let sqlQuery;
      switch (operation) {
        case 'country_name':
        sqlQuery = `
        SELECT countries.country_name FROM countries
        WHERE countries.iso3 = "${query}"
      `;
            break;

        case 'iso3':
          sqlQuery = `
          SELECT countries.iso3 FROM countries
          WHERE countries.country_name = "${query}"
        `
              break;
    
        default:
          console.log('here');
          break;
    }

      const [results] = await sequelize.query(sqlQuery);
      return results;
    } catch (error) {
      throw new Error(
        `Error fetching data: ${error.message}`
      );
    }
  };
