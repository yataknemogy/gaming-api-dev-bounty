import express from 'express';
import { generateSocialShareController } from '../controllers/socialShareController';

const router = express.Router();

router.post('/generate', generateSocialShareController);

export default router;
