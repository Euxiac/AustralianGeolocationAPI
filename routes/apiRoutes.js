import express from 'express';
import * as apiController from '../controllers/apiController.js';

const router = express.Router();

// Define the POST route
router.post('/fetch-states/:country', apiController.fetchStatesInCountry);

router.post('/fetch-cities/:country/:state', apiController.fetchCitiesInState);

router.get('/fetch-coordinates/:country/:state/:city', apiController.fetchCoordinates);

export default router;