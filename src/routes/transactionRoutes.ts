import express from 'express';
import { createTransaction } from '../controllers/transactionController';

const router = express.Router();

router.post('/create', createTransaction);

export default router;
