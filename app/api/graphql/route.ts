import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { gql } from "graphql-tag";
import axios from 'axios'; // More reliable for serverless environments

// Define GraphQL schema
const typeDefs = gql`
  type City {
    name: String!
    lat: Float!
    lon: Float!
    country: String
    state: String
    distance: Float
  }

  type Query {
    nearbyCities(lat: Float!, lon: Float!, excludeCity: String, limit: Int): [City]!
  }
`;

// Haversine formula to calculate distances
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// GraphQL resolvers
const resolvers = {
  Query: {
    nearbyCities: async (
      _: any, 
      { lat, lon, excludeCity, limit = 15 }: { 
        lat: number; 
        lon: number; 
        excludeCity?: string; 
        limit: number 
      }
    ) => {
      try {
        // Use environment variable for API key
        const API_KEY = process.env.OPENWEATHERMAP_API_KEY;
        
        if (!API_KEY) {
          throw new Error('OpenWeatherMap API key is not configured');
        }

        // Use axios for more reliable request
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/find`, 
          {
            params: {
              lat,
              lon,
              cnt: limit,
              appid: API_KEY
            },
            // Disable Axios default caching
            headers: {
              'Cache-Control': 'no-cache'
            }
          }
        );

        console.log("🔍 OpenWeatherMap Response Status:", response.status);

        const data = response.data;
        if (!data.list || !data.list.length) return [];

        const cities = data.list.map((city: any) => ({
          name: city.name,
          lat: city.coord.lat,
          lon: city.coord.lon,
          country: city.sys.country,
          state: '', // OpenWeatherMap doesn't provide state information
          distance: calculateDistance(lat, lon, city.coord.lat, city.coord.lon),
        }));

        console.log(`✅ Found ${cities.length} unique cities`);
        return cities;
      } catch(error) {
        console.error("❌ Error fetching nearby cities:", error);
        // More detailed error logging
        if (axios.isAxiosError(error)) {
          console.error('Axios Error Details:', {
            status: error.response?.status,
            data: error.response?.data
          });
        }
        return [];
      }
    },
  },
};

// Ensure Apollo Server is started only once
const server = new ApolloServer({ typeDefs, resolvers });
const handler = startServerAndCreateNextHandler(server, {
  context: async (req) => ({ req }),
});

// Named export for Next.js App Router API
export async function POST(req: Request) {
  return handler(req);
}

// Set runtime to Node.js (Required for Vercel)
export const runtime = "nodejs";
export const dynamic = 'force-dynamic'; // Ensure dynamic rendering