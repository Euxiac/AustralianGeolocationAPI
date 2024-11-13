import express from 'express';
import * as geocodingController from '../controllers/geocodingController.js';

const router = express.Router();

//router.get('/GetCoords', fetchTest.fetchCoordinatesFromQuery);
router.get('/test2', geocodingController.fetchTest);

export default router; 