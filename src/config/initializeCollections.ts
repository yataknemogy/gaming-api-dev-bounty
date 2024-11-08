import mongoose from 'mongoose';
import ChallengeModel from '../models/Challenge';
import UserModel from '../models/User';
import BetModel from '../models/Bet';
import ReviewModel from '../models/Review';
import TournamentModel from '../models/Tournament';

const initializeCollections = async () => {
    try {
        await mongoose.connection.asPromise();

        const collections = await mongoose.connection.db!.listCollections().toArray();
        const collectionNames = collections.map((c) => c.name);

        if (!collectionNames.includes('challenges')) {
            await ChallengeModel.createCollection();
            console.log('Challenge collection created');
        }

        if (!collectionNames.includes('users')) {
            await UserModel.createCollection();
            console.log('User collection created');
        }

        if (!collectionNames.includes('bets')) {
            await BetModel.createCollection();
            console.log('Bet collection created');
        }

        if (!collectionNames.includes('reviews')) {
            await ReviewModel.createCollection();
            console.log('Review collection created');
        }

        if (!collectionNames.includes('tournaments')) {
            await TournamentModel.createCollection();
            console.log('Tournament collection created');
        }

    } catch (error) {
        console.error('Error initializing collections:', error);
    }
};

export default initializeCollections;
