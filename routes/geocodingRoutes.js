const express = require('express');
const router = express.Router();
const geocodingController = require('../controllers/geocodingController');

router.get('/GEO/GetCoords', geocodingController.fetchCoordinatesFromQuery);

module.exports = router;