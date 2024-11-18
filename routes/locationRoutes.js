import express from 'express';
import * as locationController from '../controllers/locationController.js';

const router = express.Router();

const rootMessage = 'welcome to location api try /countries';

// /location/ will return the root message
router.get('/', (req, res) => {
    res.send(rootMessage);
});

router.get('/countries', locationController.fetchAllCountries);

router.get('/states', locationController.fetchAllStates);

router.get('/cities', locationController.fetchAllCities);

router.get('/query/:country/:state/:city', locationController.fetchFromQuery);

router.get('/convert/:operation/:query', locationController.convert);

export default router; 