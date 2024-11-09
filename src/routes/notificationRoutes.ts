import express from 'express';
import {
    createNotification,
    getNotificationsByUserId,
    markNotificationAsRead,
    deleteNotification,
} from '../controllers/notificationController';

const router = express.Router();

router.post('/notifications', createNotification);
router.get('/notifications/:userId', getNotificationsByUserId);
router.patch('/notifications/:notificationId/read', markNotificationAsRead);
router.delete('/notifications/:notificationId', deleteNotification);

export default router;
