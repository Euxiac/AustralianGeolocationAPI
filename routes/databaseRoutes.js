import express from 'express';
import * as databaseController from '../controllers/databaseController.js';

const router = express.Router();

const rootMessage = 'welcome to database api';

// /location/ will return the root message
router.get('/', (req, res) => {
    res.send(rootMessage);
});

router.post('/update/coords/:country/:state/:city/:lat/:lon', databaseController.updateCoords);

router.post('/delete/cities/:country/:state/:city', databaseController.deleteCity);
//deletes a city entry

router.post('/tables/redraw', databaseController.redrawTables);
//drop all tables
//create new empty tables

router.post('/tables/empty', databaseController.emptyTables)
//deletes all data inside tables

router.post('/tables/populate=mock', databaseController.populateWithMockData);
//maybe check is tables are empty?
//adds mock data to tables

router.post('/tables/populate=true', databaseController.populate);
//maybe check is tables are empty?
//makes call and adds actual data

export default router; 