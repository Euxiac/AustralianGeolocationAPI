import express from "express";
import * as databaseController from "../controllers/databaseController.js";

const router = express.Router();

const rootMessage = "welcome to database routes for database manipulation";

// /location/ will return the root message
router.get("/", (req, res) => {
  res.send(rootMessage);
});

// TABLES -------------------------------------------------------------------------
//drop all tables and creates new empty tables
router.post("/tables/redraw", databaseController.redrawTables);

//deletes all data inside tables
router.post("/tables/empty", databaseController.emptyTables);

//ONLY adds mock data to table
router.post("/tables/populate-mock", databaseController.populateWithMockData);

//ONLY add adds true api data to tables
router.post("/tables/populate-true", databaseController.populateFromAPI);

//checks if tables are empty, returns bool
router.get("/tables/check-if-empty", databaseController.areTablesEmpty);

// chains redraw tables, check if empty and populates depending on :dataset value
router.post("/tables/redraw/:dataset", databaseController.redrawTablesWithData);

// ENTRIES  ------------------------------------------------------------------------
//adds entries
router.post("/entries/add-:table", databaseController.addEntry);

router.post("/entries/delete-:table", databaseController.deleteEntry);

router.post(
  "/entries/update-coords/:country/:state/:city/:lat/:lon",
  databaseController.updateCoords
);

//deletes a city entry
router.post(
  "/entries/delete-cities/:country/:state/:city",
  databaseController.deleteCity
);

// ------------------------------------------------------------------------------------

export default router;
