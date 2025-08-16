import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { Redis } from "@upstash/redis";

export const dynamic = 'force-dynamic';

// Create Redis client using Upstash
const redis = Redis.fromEnv();

export async function GET(req: NextRequest) {
  try {
    const apiKey = process.env.OPENWEATHERMAP_API_KEY;
    const searchParams = req.nextUrl.searchParams;
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    if (!lat || !lon) {
      return new Response("Latitude and longitude parameters are required", { status: 400 });
    }

    console.log(`🔍 Request received for lat: ${lat}, lon: ${lon}`);

    // Create a cache key based on the coordinates
    const cacheKey = `pollution:${lat}:${lon}`;
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
    const url = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    const response = await axios.get(url);
    const data = response.data;

    console.log(`📦 Got API response, caching for 1 hour`);

    // Cache the result (expire after 1 hour = 3600 seconds)
    // Air pollution data can change more frequently than geocoding data
    await redis.set(cacheKey, data, { ex: 3600 });
    console.log(`💾 Data cached successfully with key: ${cacheKey}`);

    return NextResponse.json(data, {
      headers: {
        'X-Cache': 'MISS',
      }
    });
  } catch (error) {
    console.error("❌ Error in getting pollution data:", error);
    return new Response("Error fetching pollution data", { status: 500 });
  }
}


// //Using Normal API
// import { NextRequest, NextResponse } from "next/server";
// import axios from "axios";
// import { Redis } from "@upstash/redis";

// export const dynamic = 'force-dynamic';

// // Create Redis client using Upstash
// const redis = Redis.fromEnv();

// export async function GET(req: NextRequest) {
//   try {
//     const apiKey = process.env.OPENWEATHERMAP_API_KEY;
//     const searchParams = req.nextUrl.searchParams;
//     const lat = searchParams.get("lat");
//     const lon = searchParams.get("lon");

//     if (!lat || !lon) {
//       return new Response("Latitude and longitude parameters are required", { status: 400 });
//     }

//     console.log(`🔍 Request received for lat: ${lat}, lon: ${lon}`);

//     // Create a cache key based on the coordinates
//     const cacheKey = `weather:current:${lat}:${lon}`;
//     console.log(`🔑 Cache key: ${cacheKey}`);

//     // Try to get data from Redis cache
//     console.log('⏳ Checking Redis cache...');
//     const cachedData = await redis.get(cacheKey);

//     if (cachedData) {
//       console.log(`🎯 CACHE HIT for ${cacheKey}`);
//       // Return cached data
//       return NextResponse.json(cachedData, {
//         headers: {
//           'X-Cache': 'HIT',
//         }
//       });
//     }

//     console.log(`⛔ CACHE MISS for ${cacheKey}, fetching from API...`);
//     // If not in cache, fetch from API
//     const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
//     const response = await axios.get(url);
//     const data = response.data;

//     console.log(`📦 Got API response, caching for 10 minutes`);

//     // Cache the result (expire after 10 minutes = 600 seconds)
//     // Current weather data changes frequently, so shorter cache time
//     await redis.set(cacheKey, data, { ex: 600 });
//     console.log(`💾 Data cached successfully with key: ${cacheKey}`);

//     return NextResponse.json(data, {
//       headers: {
//         'X-Cache': 'MISS',
//       }
//     });
//   } catch (error) {
//     console.error("❌ Error in getting current weather data:", error);
//     return new Response("Error fetching forecast data", { status: 500 });
//   }
// }