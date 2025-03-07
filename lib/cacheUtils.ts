import { getRedisClient } from './redis';

// Invalidate a specific cache key
export async function invalidateCache(key: string): Promise<boolean> {
  const redis = getRedisClient();
  
  try {
    const result = await redis.del(`cache:${key}`);
    return result > 0;
  } catch (error) {
    console.error('Error invalidating cache:', error);
    return false;
  }
}

// Invalidate cache for a specific city across all APIs
export async function invalidateCityCache(city: string): Promise<number> {
  const redis = getRedisClient();
  
  try {
    // Get all keys matching this city
    const keys = await redis.keys(`cache:*city=${city}*`);
    
    if (keys.length === 0) {
      return 0;
    }
    
    // Delete all matching keys
    const result = await redis.del(...keys);
    return result;
  } catch (error) {
    console.error('Error invalidating city cache:', error);
    return 0;
  }
}

// Clear all cache
export async function clearAllCache(): Promise<number> {
  const redis = getRedisClient();
  
  try {
    const keys = await redis.keys('cache:*');
    
    if (keys.length === 0) {
      return 0;
    }
    
    const result = await redis.del(...keys);
    return result;
  } catch (error) {
    console.error('Error clearing cache:', error);
    return 0;
  }
}