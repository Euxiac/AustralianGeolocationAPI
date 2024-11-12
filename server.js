const express = require('express');
const bodyParser = require("body-parser");
const path = require('path');
const sequelize = require('./config/database');
const countries =  require('./models/countries');
const states =  require('./models/states');
const cities =  require('./models/cities');

// Initialize the app
const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());
app.use(express.json()); // To parse JSON request body

// Allow all origins or specify domain
// this bit is about bypassing the CORS policy for local connections. see enable-cors.org
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

(async () => {
  try {
    app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname,'index.html'))});
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Unable to connect to the database:', err.message);
  }
})();

sequelize.sync({ force:false})
.then(() => {
  console.log('db and tables created');
})
.catch(err => console.log('error synching tables', err));

//routes
app.post('/geolocate', async (req, res) => {
  try {
    console.log('try');
    res.status(201).json(console.log('try'));
  }
  catch (error) {
    res.status(400).json({error:error.message});
  }
});