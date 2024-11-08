import { IUser } from '../models/User';
import { IChallenge } from '../models/Challenge';
import { generateAchievementMessage, generateAchievementLink, getSocialShareLinks } from '../utils/socialShareUtils';

export const generateSocialShareContent = (user: IUser, challenge: IChallenge) => {
    const message = generateAchievementMessage(user, challenge);
    const achievementLink = generateAchievementLink(user._id.toString(), challenge._id.toString());
    const shareLinks = getSocialShareLinks(message, achievementLink);

    return {
        message,
        achievementLink,
        shareLinks
    };
};
