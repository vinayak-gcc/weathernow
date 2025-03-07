import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

export const dynamic = 'force-dynamic';

// Create Redis client using Upstash
const redis = Redis.fromEnv();

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    if (!lat || !lon) {
      return new Response("Latitude and longitude parameters are required", { status: 400 });
    }

    console.log(`🔍 Request received for lat: ${lat}, lon: ${lon}`);

    // Create a cache key based on the coordinates
    const cacheKey = `uv:${lat}:${lon}`;
    console.log(`🔑 Cache key: ${cacheKey}`);

    // Try to get data from Redis cache
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
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=uv_index_max,uv_index_clear_sky_max&timezone=auto&forecast_days=1`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`UV API error: ${response.status}`);
    }
    
    const uvData = await response.json();
    console.log(`📦 Got API response, caching for 15 minutes`);

    // Cache the result (expire after 15 minutes = 900 seconds)
    // This matches the revalidate time you were using before
    await redis.set(cacheKey, uvData, { ex: 900 });
    console.log(`💾 Data cached successfully with key: ${cacheKey}`);

    return NextResponse.json(uvData, {
      headers: {
        'X-Cache': 'MISS',
      }
    });
  } catch (error) {
    console.error("❌ Error in getting UV data:", error);
    return new Response("Error getting UV Data", { status: 500 });
  }
}

// // Using Normal API
// export const dynamic = 'force-dynamic'


// import { NextRequest, NextResponse } from "next/server";

// export async function GET(req: NextRequest) {
//   try {
//     const searchParams = req.nextUrl.searchParams;

//     const lat = searchParams.get("lat");
//     const lon = searchParams.get("lon");

//     const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=uv_index_max,uv_index_clear_sky_max&timezone=auto&forecast_days=1`;

//     const res = await fetch(url, {
//       next: { revalidate: 900 },
//     });

//     const uvData = await res.json();

//     return NextResponse.json(uvData);
//   } catch (error) {
//     console.log("Error Getting Uv Data");

//     return new Response("Error getting Uv Data", { status: 500 });
//   }
// }