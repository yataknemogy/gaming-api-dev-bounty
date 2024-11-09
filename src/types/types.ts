export interface BetStatistics {
    totalBets: number;
    totalAmount: number;
    totalWon: number;
    totalLost: number;
    averageOdds: number;
    averageWinAmount: number;
}

export enum ChallengeCategory {
    FITNESS = "Fitness",
    ART = "Art",
    TRAVEL = "Travel",
    ADVENTURE = "Adventure",
    LIFESTYLE = "Lifestyle",
    GAMING = "Gaming",
    SPORTS = "Sports",
    SOCIAL_MEDIA = "Social Media",
    EVENT = "Event",
    RANDOM = "Random",
}
