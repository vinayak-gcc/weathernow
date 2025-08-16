import { Redis } from 'ioredis';

// Create a Redis client with singleton pattern
let redis: Redis | null = null;

export const getRedisClient = () => {
  if (!redis) {
    redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
  }
  return redis;
};

export default getRedisClient;