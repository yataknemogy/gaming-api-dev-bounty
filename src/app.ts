import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import connectToDatabase from './config/db';
import initializeCollections from './config/initializeCollections';
import { errorHandler, AppError } from './utils/errorHandler';
import { logEvent } from './utils/logger';
import userRoutes from './routes/userRoutes';
import betRoutes from './routes/betRoutes';
import challengeRoutes from './routes/challengeRoutes';
import tournamentRoutes from './routes/tournamentRoutes';
import socialShareRoutes from './routes/socialShareRoutes';
import ratingRoutes from './routes/ratingRoutes';

dotenv.config();

const app = express();
app.use(express.json());

connectToDatabase()
    .then(() => initializeCollections())
    .catch((error) => {
        console.error('Database connection or collection initialization failed:', error);
        process.exit(1);
    });

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the Gaming API!');
    logEvent('Root Accessed', { message: 'Root route was accessed' }, 'info');
});

app.use('/api/users', userRoutes);
app.use('/api/bets', betRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/social-share', socialShareRoutes);
app.use('/api/ratings', ratingRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
    const error = new AppError(`Route ${req.originalUrl} not found`, 404);
    next(error);
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    logEvent('Server Started', { port: PORT }, 'info');
});
