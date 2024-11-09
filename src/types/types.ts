import { PublicKey, Connection } from "@solana/web3.js";
import { BN, Program } from "@coral-xyz/anchor";

export enum CHALLENGE_STATE {
    UPCOMING = "UPCOMING",
    ONGOING = "ONGOING",
    PROCESSING = "PROCESSING",
    PAYINGOUT = "PAYINGOUT",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
}

export enum VERIFIED_CURRENCY {
    USDC = "USDC",
    SOL = "SOL",
    BONK = "BONK",
    SEND = "SEND",
}

export enum CHALLENGE_CATEGORIES {
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

export enum NOTIFICATION_TYPE {
    SIGNUP = "SIGNUP",
    CHALLENGE_CREATED = "CHALLENGE_CREATED",
    CHALLENGE_JOINED_SELF = "CHALLENGE_JOINED_SELF",
    CHALLENGE_JOINED_PLAYER = "CHALLENGE_JOINED_PLAYER",
    CHALLENGE_JOINED_CREATOR = "CHALLENGE_JOINED_CREATOR",
    CHALLENGE_MAX_PARTICIPATION_REACHED_CREATOR = "CHALLENGE_MAX_PARTICIPATION_REACHED_CREATOR",
    CHALLENGE_MAX_PARTICIPATION_REACHED_PLAYER = "CHALLENGE_MAX_PARTICIPATION_REACHED_PLAYER",
    CHALLENGE_CANCELLED_SELF = "CHALLENGE_CANCELLED_SELF",
    CHALLENGE_CANCELLED_PLAYER = "CHALLENGE_CANCELLED_PLAYER",
    CHALLENGE_STARTED_SELF = "CHALLENGE_STARTED_SELF",
    CHALLENGE_STARTED_PLAYER = "CHALLENGE_STARTED_PLAYER",
    CHALLENGE_ENDED_SELF = "CHALLENGE_ENDED_SELF",
    CHALLENGE_ENDED_PLAYER = "CHALLENGE_ENDED_PLAYER",
    CHALLENGE_SETTLED_WITH_NO_WINNER = "CHALLENGE_SETTLED_WITH_NO_WINNER",
    CHALLENGE_SETTLED_WITH_NO_WINNER_CREATOR = "CHALLENGE_SETTLED_WITH_NO_WINNER_CREATOR",
    CHALLENGE_SETTLED_WITH_WINNER_SELF = "CHALLENGE_SETTLED_WITH_WINNER_SELF",
    CHALLENGE_SETTLED_WITH_WINNER_CREATOR = "CHALLENGE_SETTLED_WITH_WINNER_CREATOR",
    CHALLENGE_SETTLED_WITH_WINNER = "CHALLENGE_SETTLED_WITH_WINNER",
    WITHDRAW_REQUEST = "WITHDRAW_REQUEST",
    WITHDRAW_SUCCESS = "WITHDRAW_SUCCESS",
    WITHDRAW_FAILED = "WITHDRAW_FAILED",
    DEPOSIT_REQUEST = "DEPOSIT_REQUEST",
    DEPOSIT_SUCCESS = "DEPOSTI_SUCCESS",
    DEPOSIT_FAILED = "DEPOSIT_FAILED",
}

export enum CLUSTER_TYPES {
    DEVNET = "devnet",
    MAINNET = "mainnet",
    STAGING = "staging",
}

export interface Challenge {
    ChallengeID: number;
    ChallengeName: string;
    ChallengeDescription: string;
    StartDate: number | null;
    EndDate: number | null;
    GameID: number;
    Wager: number;
    Target: number | null;
    State: CHALLENGE_STATE;
    Currency: VERIFIED_CURRENCY;
    Category: CHALLENGE_CATEGORIES | null;
}

export interface ICreateChallenge {
    ChallengeName: string;
    ChallengeDescription: string;
    StartDate: number;
    EndDate: number;
    GameID: number;
    Wager: number;
    Target: number;
    AllowSideBets: boolean;
    SideBetsWager: number;
    Currency: VERIFIED_CURRENCY;
    ChallengeCategory: CHALLENGE_CATEGORIES;
    UserAddress?: string;
}

export interface ICreateTransaction {
    accountPublicKey: PublicKey;
    recipientPublicKey: PublicKey;
    currency: VERIFIED_CURRENCY;
    amount: number;
    connection: Connection;
    cluster: keyof typeof ONCHAIN_CONFIG;
    zeroWager?: boolean;
}

export interface TransactionResult {
    success: boolean;
    transactionSignature: string;
}

export interface TransactionError {
    message: string;
    code: number;
}

export interface ICreateTournament {
    TournamentName: string;
    TournamentDescription: string;
    StartDate: number;
    EndDate: number;
    Category: CHALLENGE_CATEGORIES;
    Currency: VERIFIED_CURRENCY;
    EntryFee: number;
    PrizePool: number;
    MaxParticipants: number;
    OrganizerAddress: PublicKey;
}

export interface ITournamentById {
    TournamentID: number;
    TournamentName: string;
    TournamentDescription: string;
    StartDate: number;
    EndDate: number;
    Category: CHALLENGE_CATEGORIES;
    State: CHALLENGE_STATE;
    Currency: VERIFIED_CURRENCY;
    EntryFee: number;
    PrizePool: number;
    MaxParticipants: number;
    OrganizerAddress: PublicKey;
    Participants: PublicKey[];
}

export interface IPlaceBet {
    betAmount: number;
    currency: VERIFIED_CURRENCY;
    challengeID: number;
    userAddress: PublicKey;
    opponentAddress?: PublicKey;
}

export interface BetResult {
    success: boolean;
    betID: number;
    transactionSignature: string;
}

export interface ResultWithError<T = any> {
    data: T | null;
    error: string | null;
}

export interface IChallengeById {
    ChallengeID: number;
    ChallengeName: string;
    ChallengeDescription: string;
    StartDate: number;
    EndDate: number;
    State: CHALLENGE_STATE;
    MaxParticipants: number;
    Currency: VERIFIED_CURRENCY;
    Category: CHALLENGE_CATEGORIES;
    ChallengeCreator: PublicKey;
    GameID: number;
}

export interface IUser {
    UserID: number;
    UserName: string | null;
    WalletAddress: PublicKey | null;
    Credits: number;
}

export interface IWeb3Participate {
    account: PublicKey;
    playerId: BN;
    challengeId: BN;
    amount: BN;
    currency?: VERIFIED_CURRENCY;
    onchainParticipateType: ONCHAIN_PARTICIPATE_TYPE;
}

export enum ONCHAIN_PARTICIPATE_TYPE {
    JOIN_CHALLENGE = "joinChallenge",
    SIDE_BET = "sideBet",
}

export interface IGetTxObject extends IWeb3Participate {
    userPublicKey: PublicKey;
    escrowTokenAccount: PublicKey;
    userTokenAccount: PublicKey;
    program: Program;
    cluster: keyof typeof ONCHAIN_CONFIG;
}

export interface INotification {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: NOTIFICATION_TYPE;
    challengeId?: number;
    tournamentId?: number;
    status?: CHALLENGE_STATE;
    currency?: VERIFIED_CURRENCY;
    createdAt: Date;
    isRead: boolean;
}

export const ONCHAIN_CONFIG = {
    devnet: {
        BackendURL: "https://apiv2.catoff.xyz",
        nodeURL: "https://api.devnet.solana.com",
        partnerApiKey: process.env.PARTNER_API_KEY_DEVNET,
    },
    mainnet: {
        BackendURL: "https://mainnet-apiv2.catoff.xyz",
        nodeURL: process.env.RPC_URL,
        partnerApiKey: process.env.PARTNER_API_KEY_MAINNET,
    },
};
