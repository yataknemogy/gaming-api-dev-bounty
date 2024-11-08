import { IUser } from '../models/User';
import { IChallenge } from '../models/Challenge';

export const generateAchievementMessage = (user: IUser, challenge: IChallenge): string => {
    return `🎉 ${user.username} just completed the challenge "${challenge.title}" with a stake of ${challenge.stakeAmount} tokens! Join the fun and challenge yourself too! #ChallengeAccepted #AchievementUnlocked`;
};

export const generateAchievementLink = (userId: string, challengeId: string): string => {
    const baseUrl = process.env.BASE_URL || 'https://catoff.xyz';
    return `${baseUrl}/achievements?user=${userId}&challenge=${challengeId}`;
};

export const getSocialShareLinks = (message: string, achievementLink: string) => {
    const encodedMessage = encodeURIComponent(message);
    const encodedLink = encodeURIComponent(achievementLink);

    return {
        twitter: `https://twitter.com/intent/tweet?text=${encodedMessage}%20${encodedLink}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}`,
        linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedLink}&title=${encodedMessage}`
    };
};
