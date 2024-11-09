import { GenericError } from '../errors/errorHandling';

const parseRelativeTime = (time: string): number => {
    const timeSegments = time.split(/[\s&-]/);
    let totalMilliseconds = 0;

    timeSegments.forEach((segment) => {
        const matches = segment.match(/^(\d+)([smhd])$/);
        if (!matches) {
            throw new GenericError(`Invalid time format for segment: ${segment}`, 400);
        }

        const value = parseInt(matches[1], 10);
        const unit = matches[2];

        let segmentMilliseconds = 0;
        switch (unit) {
            case "s":
                segmentMilliseconds = value * 1000;
                break;
            case "m":
                segmentMilliseconds = value * 60 * 1000;
                break;
            case "h":
                segmentMilliseconds = value * 60 * 60 * 1000;
                break;
            case "d":
                segmentMilliseconds = value * 24 * 60 * 60 * 1000;
                break;
            default:
                throw new GenericError(`Invalid time unit: ${unit}`, 400);
        }

        totalMilliseconds += segmentMilliseconds;
    });

    return totalMilliseconds;
};

export const calculateTimeRange = (
    startTime: string,
    duration: string,
): { startDate: number; endDate: number } => {
    let startDate: number;

    if (/^(\d+[smhd][\s&-]?)+$/.test(startTime)) {
        startDate = Date.now() + parseRelativeTime(startTime);
    } else {
        startDate = Date.parse(startTime);
        if (isNaN(startDate)) {
            throw new GenericError("Invalid start time format", 400);
        }
    }

    const durationInMs = parseRelativeTime(duration);
    const endDate = startDate + durationInMs;

    return { startDate, endDate };
};

export { parseRelativeTime };
