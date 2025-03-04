import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { gql } from 'graphql-tag';

// Define your GraphQL schema
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

// Define your resolvers
const resolvers = {
  Query: {
    nearbyCities: async (_: any, { lat, lon, excludeCity, limit = 15 }: { lat: number; lon: number; excludeCity?: string; limit: number }) => {
      try {
        const response = await fetch(
          `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&type=city&limit=15&apiKey=f9e1b444125a42409c1941f6b2a15d18`
        );
        const data = await response.json();

        if (!data.features || !data.features.length) return [];

        const uniqueCityNames = new Set<string>();

        const cities = data.features
          .map((feature: any) => {
            const cityName = feature.properties.city || feature.properties.name;
            if (!cityName) return null;

            return {
              name: cityName,
              lat: feature.properties.lat,
              lon: feature.properties.lon,
              country: feature.properties.country,
              state: feature.properties.state,
              distance: calculateDistance(lat, lon, feature.properties.lat, feature.properties.lon),
            };
          })
          .filter((city: any) => {
            if (!city) return false;
            if (excludeCity && city.name.toLowerCase() === excludeCity.toLowerCase()) {
              return false;
            }
            if (city.distance > 900) return false;

            const cityKey = city.name.toLowerCase();
            if (uniqueCityNames.has(cityKey)) return false;

            uniqueCityNames.add(cityKey);
            return true;
          })
          .sort((a: { distance: number }, b: { distance: number }) => a.distance - b.distance)
          .slice(0, limit);

        console.log(`Found ${cities.length} unique cities after filtering`);
        return cities;
      } catch (error) {
        console.error('Error fetching nearby cities:', error);
        return [];
      }
    },
  },
};

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Export handler with CORS configuration
const handler = startServerAndCreateNextHandler(server, {
  context: async (req) => ({ req }),
});

export { handler as GET, handler as POST };
