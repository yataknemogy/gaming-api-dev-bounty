import express from 'express';
import {
    createChallengeController,
    joinChallengeController,
    completeChallengeController,
    expireChallengesController,
    getPublicChallengesController,
    getChallengeStatisticsController
} from '../controllers/challengeController';

const router = express.Router();

router.post('/', createChallengeController);
router.post('/:challengeId/join', joinChallengeController);
router.post('/:challengeId/complete', completeChallengeController);
router.post('/expire', expireChallengesController);
router.get('/public', getPublicChallengesController);
router.get('/:challengeId/statistics', getChallengeStatisticsController);

export default router;
