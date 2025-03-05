import { ApolloClient, InMemoryCache } from '@apollo/client';

// Determine the base URL based on the environment
const getGraphQLUrl = () => {
  if (typeof window !== 'undefined') {
    // Client-side: use relative path
    return '/api/graphql';
  }
  
  // Explicitly set Vercel URL for server
  return 'https://weathernow-ten.vercel.app/api/graphql';
};

export const client = new ApolloClient({
  uri: getGraphQLUrl(),
  cache: new InMemoryCache(),
  credentials: 'same-origin',
  
  // Enhanced error handling
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    }
  }
});