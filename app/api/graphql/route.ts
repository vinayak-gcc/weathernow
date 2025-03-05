import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { gql } from "graphql-tag";

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
        // OpenWeatherMap API call to find nearby cities
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lon}&cnt=${limit}&apikey=584891dc024538f7ace401e33311c3ad`,
          { cache: "no-store" }
        );

        console.log("🔍 OpenWeatherMap Response Status:", response.status);
        if (!response.ok) {
          throw new Error(`OpenWeatherMap API error: ${response.statusText}`);
        }

        const data = await response.json();
        if (!data.list || !data.list.length) return [];

        const uniqueCityNames = new Set<string>();

        const cities = data.list
          .map((city: any) => {
            return {
              name: city.name,
              lat: city.coord.lat,
              lon: city.coord.lon,
              country: city.sys.country,
              state: '', // OpenWeatherMap doesn't provide state information
              distance: calculateDistance(lat, lon, city.coord.lat, city.coord.lon),
            };
          })
          .filter((city: any) => {
            if (excludeCity && city.name.toLowerCase() === excludeCity.toLowerCase()) return false;
            if (city.distance > 900) return false;

            const cityKey = city.name.toLowerCase();
            if (uniqueCityNames.has(cityKey)) return false;

            uniqueCityNames.add(cityKey);
            return true;
          })
          .sort((a: { distance: number }, b: { distance: number }) => a.distance - b.distance)
          .slice(0, limit);

        console.log(`✅ Found ${cities.length} unique cities after filtering`);
        return cities;
      } catch(error) {
        console.error("❌ Error fetching nearby cities:", error);
        return [];
      }
    },
  },
};

// ✅ Ensure Apollo Server is started only once
const server = new ApolloServer({ typeDefs, resolvers });
const handler = startServerAndCreateNextHandler(server, {
  context: async (req) => ({ req }),
});

// ✅ Named export for Next.js App Router API
export async function POST(req: Request) {
  return handler(req);
}

// ✅ Set runtime to Node.js (Required for Vercel)
export const runtime = "nodejs";