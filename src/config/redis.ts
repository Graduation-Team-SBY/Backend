import Redis from "ioredis";
const redisUri = process.env.REDIS_URI as string;

// ! input redis url
// export const redis = new Redis();
export const redis = new Redis(redisUri);
