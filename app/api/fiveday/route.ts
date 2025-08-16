//Using Upsatsh redis
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from "next/server";
import { Redis } from '@upstash/redis'

// Create Upstash Redis client
const redis = Redis.fromEnv();

export async function GET(req: NextRequest) {
  try {
    const apiKey = process.env.OPENWEATHERMAP_API_KEY;
    const searchParams = req.nextUrl.searchParams;
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    console.log(`🔍 Request received for lat: ${lat}, lon: ${lon}`);

    // Create a cache key based on the coordinates
    const cacheKey = `weather:fiveday:${lat}:${lon}`;
    console.log(`🔑 Cache key: ${cacheKey}`);

    // Try to get data from Upstash Redis cache
    console.log('⏳ Checking Redis cache...');
    const cachedData = await redis.get(cacheKey);
    
    if (cachedData) {
      console.log(`🎯 CACHE HIT for ${cacheKey}`);
      // Return cached data
      return NextResponse.json(cachedData, {
        headers: {
          'X-Cache': 'HIT',
        }
      });
    }

    console.log(`⛔ CACHE MISS for ${cacheKey}, fetching from API...`);
    // If not in cache, fetch from API
    const dailyUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    const dailyRes = await fetch(dailyUrl);

    if (!dailyRes.ok) {
      throw new Error(`Weather API error: ${dailyRes.status}`);
    }

    const dailyData = await dailyRes.json();
    console.log(`📦 Got API response, caching for 1 hour`);

    // Cache the result (expire after 1 hour = 3600 seconds)
    await redis.set(cacheKey, dailyData, { ex: 3600 });
    console.log(`💾 Data cached successfully with key: ${cacheKey}`);

    return NextResponse.json(dailyData, {
      headers: {
        'X-Cache': 'MISS',
      }
    });
  } catch (error) {
    console.error("❌ Error in getting five day data:", error);
    return new Response("Error in getting five day data", { status: 500 });
  }
}

//using Docker
// export const dynamic = 'force-dynamic'

// import { NextRequest, NextResponse } from "next/server";
// import { Redis } from "ioredis";

// // Create Redis client
// const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// // Log when Redis connection is established
// redis.on('connect', () => {
//   console.log('✅ Redis connection established successfully');
// });

// // Log Redis errors
// redis.on('error', (err) => {
//   console.error('❌ Redis connection error:', err);
// });

// export async function GET(req: NextRequest) {
//   try {
//     const apiKey = process.env.OPENWEATHERMAP_API_KEY;
//     const searchParams = req.nextUrl.searchParams;
//     const lat = searchParams.get("lat");
//     const lon = searchParams.get("lon");

//     console.log(`🔍 Request received for lat: ${lat}, lon: ${lon}`);

//     // Create a cache key based on the coordinates
//     const cacheKey = `weather:fiveday:${lat}:${lon}`;
//     console.log(`🔑 Cache key: ${cacheKey}`);

//     // Try to get data from Redis cache
//     console.log('⏳ Checking Redis cache...');
//     const cachedData = await redis.get(cacheKey);
    
//     if (cachedData) {
//       console.log(`🎯 CACHE HIT for ${cacheKey}`);
//       // Return cached data
//       return NextResponse.json(JSON.parse(cachedData), {
//         headers: {
//           'X-Cache': 'HIT',
//         }
//       });
//     }

//     console.log(`⛔ CACHE MISS for ${cacheKey}, fetching from API...`);
//     // If not in cache, fetch from API
//     const dailyUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
//     const dailyRes = await fetch(dailyUrl);

//     if (!dailyRes.ok) {
//       throw new Error(`Weather API error: ${dailyRes.status}`);
//     }

//     const dailyData = await dailyRes.json();
//     console.log(`📦 Got API response, caching for 1 hour`);

//     // Cache the result (expire after 1 hour = 3600 seconds)
//     await redis.set(cacheKey, JSON.stringify(dailyData), 'EX', 3600);
//     console.log(`💾 Data cached successfully with key: ${cacheKey}`);

//     return NextResponse.json(dailyData, {
//       headers: {
//         'X-Cache': 'MISS',
//       }
//     });
//   } catch (error) {
//     console.error("❌ Error in getting five day data:", error);
//     return new Response("Error in getting five day data", { status: 500 });
//   }
// }