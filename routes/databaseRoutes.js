import express from 'express';
import * as databaseController from '../controllers/databaseController.js';

const router = express.Router();

const rootMessage = 'welcome to database routes for database manipulation';

// /location/ will return the root message
router.get('/', (req, res) => {
    res.send(rootMessage);
});

// TABLES -------------------------------------------------------------------------
//drop all tables and creates new empty tables
router.post('/tables/redraw', databaseController.redrawTables);

//deletes all data inside tables
router.post('/tables/empty', databaseController.emptyTables);

//ONLY adds mock data to table
router.post('/tables/populate-mock', databaseController.populateWithMockData);

//ONLY add adds true api data to tables
router.post('/tables/populate-true', databaseController.populateFromAPI);

//checks if tables are empty, returns bool
router.get('/check-if-tables-empty', databaseController.areTablesEmpty);

// chains redraw tables, check if empty and populates depending on :dataset value
router.post('/tables/redraw/:dataset', databaseController.redrawTablesWithData);


// ENTRIES  ------------------------------------------------------------------------
//checks if entry exists, matches all columns, returns bool, called through /add
router.get('/entries/check-exists/:table', databaseController.checkEntryExists);

//adds entries
router.post('/entries/add/country', databaseController.addCountry);
router.post('/entries/add/state', databaseController.addCountry);
router.post('/entries/add/city', databaseController.addCountry);

router.post('/entries/update-coords/:country/:state/:city/:lat/:lon', databaseController.updateCoords);

//deletes a city entry
router.post('/entries/delete-cities/:country/:state/:city', databaseController.deleteCity);

// ------------------------------------------------------------------------------------


export default router; 
