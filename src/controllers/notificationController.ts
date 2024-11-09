import { Request, Response, NextFunction } from 'express';
import { NotificationService } from '../services/notificationService';
import { NOTIFICATION_TYPE } from '../types/types';
import { validateParameters } from '../utils/validation';
import { GenericError } from '../errors/errorHandling';

export const createNotification = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, title, message, type, challengeId, tournamentId, status, currency } = req.body;

        validateParameters('userId', !!userId, 'User ID is required');
        validateParameters('title', !!title, 'Title is required');
        validateParameters('message', !!message, 'Message is required');
        validateParameters('type', !!type && Object.values(NOTIFICATION_TYPE).includes(type), 'Invalid notification type');

        const notification = await NotificationService.createNotification(
            userId,
            title,
            message,
            type as NOTIFICATION_TYPE,
            { challengeId, tournamentId, status, currency }
        );

        if (notification.error) {
            throw new GenericError(notification.error, 500);
        }

        res.status(201).json(notification.data);
    } catch (error) {
        next(error);
    }
};

export const getNotificationsByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;
        validateParameters('userId', !!userId, 'User ID is required');

        const notifications = await NotificationService.getNotificationsByUserId(userId);

        if (notifications.error) {
            throw new GenericError(notifications.error, 500);
        }

        res.status(200).json(notifications.data);
    } catch (error) {
        next(error);
    }
};

export const markNotificationAsRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { notificationId } = req.params;
        validateParameters('notificationId', !!notificationId, 'Notification ID is required');

        const result = await NotificationService.markNotificationAsRead(notificationId);

        if (result.error) {
            throw new GenericError(result.error, 404);
        }

        res.status(200).json({ message: 'Notification marked as read' });
    } catch (error) {
        next(error);
    }
};

export const deleteNotification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { notificationId } = req.params;
        validateParameters('notificationId', !!notificationId, 'Notification ID is required');

        const result = await NotificationService.deleteNotification(notificationId);

        if (result.error) {
            throw new GenericError(result.error, 404);
        }

        res.status(200).json({ message: 'Notification deleted successfully' });
    } catch (error) {
        next(error);
    }
};
