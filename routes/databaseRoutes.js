import express from 'express';
import * as databaseController from '../controllers/databaseController.js';

const router = express.Router();

const rootMessage = 'welcome to database api';

// /location/ will return the root message
router.get('/', (req, res) => {
    res.send(rootMessage);
});

router.post('/update/coords/:country/:state/:city/:lat/:lon', databaseController.updateCoords);

export default router; 