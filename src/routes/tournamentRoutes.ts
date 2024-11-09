import express from 'express';
import { createTournament, getTournamentById } from '../controllers/tournamentController';

const router = express.Router();

router.post('/', createTournament);
router.get('/:id', getTournamentById);

export default router;
