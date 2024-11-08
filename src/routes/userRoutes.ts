import express from 'express';
import {
    registerUserController,
    getUserByPublicKeyController,
    updateUserBalanceController,
    getTopUsersByTotalBetAmountController,
    depositToUserBalanceController
} from '../controllers/userController';

const router = express.Router();

router.post('/register', registerUserController);
router.get('/:publicKey', getUserByPublicKeyController);
router.put('/:publicKey/balance', updateUserBalanceController);
router.post('/:publicKey/deposit', depositToUserBalanceController);
router.get('/top-users', getTopUsersByTotalBetAmountController);

export default router;
