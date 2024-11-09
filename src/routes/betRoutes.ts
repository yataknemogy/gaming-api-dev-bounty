import express from 'express';
import {
    createBetController,
    updateBetStatusController,
    getUserBetStatisticsController
} from '../controllers/betController';

const router = express.Router();

router.post('/', createBetController);
router.post('/:betId/status', updateBetStatusController);
router.get('/user/:userId/statistics', getUserBetStatisticsController);

export default router;
