import express from 'express';
import { createChallenge, getChallengeById, getChallengeShareLinkHandler } from '../controllers/challengeController';

const router = express.Router();

router.post('/challenge', createChallenge);
router.get('/challenge/:id', getChallengeById);
router.get('/challenge/share/:slug', getChallengeShareLinkHandler);

export default router;
