import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import sequelize from './config/database.js';
import geoCodingRoutes from './routes/geocodingRoutes.js';
import countries from './models/countries.js';
import states from './models/states.js';
import cities from './models/cities.js';

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

app.use('/geo', geoCodingRoutes);