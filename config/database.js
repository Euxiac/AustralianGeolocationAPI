import Sequelize from "sequelize";

const sequelize = new Sequelize("geolocation_database", "root", "29121995", {
  host: "localhost",
  dialect: "mysql",
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to the database');
    }
    catch(error) {
        console.log('Unabled to connected to database');
    }
  })();

export default sequelize;