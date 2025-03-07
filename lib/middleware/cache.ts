import { NextRequest, NextResponse } from 'next/server';
import { getRedisClient } from '../redis';

type CacheOptions = {
  ttl: number; // Time to live in seconds
};

export async function withCache(
  req: NextRequest,
  handler: () => Promise<Response>,
  options: CacheOptions = { ttl: 1800 } // Default 30 minutes
) {
  // Only cache GET requests
  if (req.method !== 'GET') {
    return handler();
  }

  const redis = getRedisClient();
  const cacheKey = `cache:${req.url}`;

  try {
    // Try to get data from cache
    const cachedData = await redis.get(cacheKey);
    
    if (cachedData) {
      // Return cached data with proper headers
      const data = JSON.parse(cachedData);
      return NextResponse.json(data, {
        headers: {
          'X-Cache': 'HIT',
          'Cache-Control': `public, max-age=${options.ttl}`
        }
      });
    }

    // If not in cache, execute the handler
    const response = await handler();
    const data = await response.json();

    // Cache the response
    await redis.set(cacheKey, JSON.stringify(data), 'EX', options.ttl);

    // Return the response with cache miss header
    return NextResponse.json(data, {
      headers: {
        'X-Cache': 'MISS',
        'Cache-Control': `public, max-age=${options.ttl}`
      }
    });
  } catch (error) {
    console.error('Redis cache error:', error);
    // If caching fails, just execute the handler
    return handler();
  }
}