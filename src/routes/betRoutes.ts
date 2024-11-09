import express from 'express';
import { placeBet, getBetStatus } from '../controllers/betController';

const router = express.Router();

router.post('/', placeBet);
router.get('/:betID/status', getBetStatus);

export default router;
