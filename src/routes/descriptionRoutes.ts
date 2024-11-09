import express from 'express';
import { generateAIDescription } from '../controllers/descriptionController';

const router = express.Router();

router.post('/generate', generateAIDescription);

export default router;
