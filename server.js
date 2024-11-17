import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import sequelize from './config/database.js';
import geocodingRoutes from './routes/geocodingRoutes.js';
import locationRoutes from './routes/locationRoutes.js'
import databaseRoutes from './routes/databaseRoutes.js'
import apiRoutes from './routes/apiRoutes.js'
import countries from './models/countries.js';
import states from './models/states.js';
import cities from './models/cities.js';
import axios from 'axios';

//allow __dir name to be used
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

// Initialize the app
const app = express();
const port = 8000;

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

app.post('/call-external-api', async (req, res) => {
  try {
    // The external API URL
    const apiUrl = 'https://countriesnow.space/api/v0.1/countries/states';

    // Raw body data you want to send
    const requestBody = {
      country: 'Australia'
    };

    // Send the POST request with raw body data
    const response = await axios.post(apiUrl, requestBody, {
      headers: {
        'Content-Type': 'application/json', // Ensure that the API understands the body format
      }
    });

    // Send the response from the external API back to the client
    res.json(response.data);
  } catch (error) {
    console.error('Error making API call:', error);
    res.status(500).send('Error communicating with external API');
  }
});

app.use('/geo', geocodingRoutes);
app.use('/location', locationRoutes);
app.use('/database', databaseRoutes);
app.use('/api', apiRoutes);