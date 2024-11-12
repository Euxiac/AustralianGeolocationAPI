const express = require('express');
const bodyParser = require("body-parser");
const path = require('path');

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
    //await sequelize.sync(); DATABASE SYNC
    app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname,'index.html'))});
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Unable to connect to the database:', err.message);
  }
})();
