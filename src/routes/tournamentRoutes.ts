import express from 'express';
import {
    createTournamentController,
    addParticipantController,
    advanceToNextRoundController,
    endTournamentController
} from '../controllers/tournamentController';

const router = express.Router();

router.post('/', createTournamentController);
router.post('/:tournamentId/participants', addParticipantController);
router.post('/:tournamentId/advance', advanceToNextRoundController);
router.post('/:tournamentId/end', endTournamentController);

export default router;
