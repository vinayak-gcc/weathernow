import { useState, useEffect, JSXElementConstructor, Key, PromiseLikeOfReactNode, ReactElement, ReactNode, ReactPortal } from "react";
import { gql, useQuery } from "@apollo/client";
import defaultStates from "@/app/utils/defaultStates";
import { useGlobalContextUpdate } from "../context/globalContext";

const GET_NEARBY_CITIES = gql`
  query GetNearbyCities($lat: Float!, $lon: Float!, $limit: Int) {
    nearbyCities(lat: $lat, lon: $lon, limit: $limit) {
      name
      lat
      lon
      country
      state
      distance
    }
  }
`;

function Topcities() {
  const { setActiveCityCoords } = useGlobalContextUpdate();
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Add console logs to debug IP location fetch
  useEffect(() => {
    fetch('https://api.geoapify.com/v1/ipinfo?&apiKey=f9e1b444125a42409c1941f6b2a15d18')
      .then(response => response.json())
      .then(data => {
        console.log('Location data:', data); // Debug log
        if (data.location) {
          setUserCoords([data.location.latitude, data.location.longitude]);
          setLoading(false); // Add this line to update loading state
        } else {
          setError(true);
          setLoading(false);
        }
      })
      .catch(error => {
        console.error('Error fetching location:', error);
        setError(true);
        setLoading(false);
      });
  }, []);

  // Add more detailed debug logging for the GraphQL query
  const { data: citiesData, loading: citiesLoading, error: citiesError } = useQuery(GET_NEARBY_CITIES, {
    variables: {
      lat: userCoords?.[0] ?? 0,
      lon: userCoords?.[1] ?? 0,
      limit: 5
    },
    skip: !userCoords,
    onCompleted: (data) => {
      console.log('GraphQL Response:', {
        hasData: !!data,
        citiesArray: data?.nearbyCities,
        numberOfCities: data?.nearbyCities?.length,
        coordinates: userCoords,
        requestedLimit: 5
      });
    },
    onError: (error) => {
      console.error('GraphQL query error:', error);
    }
  });

  const getClickedCityCords = (lat: number, lon: number) => {
    setActiveCityCoords([lat, lon]);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Modify the displayCities logic to respect the limit
  const displayCities = (citiesData?.nearbyCities?.length > 3)
    ? citiesData.nearbyCities.slice(0, 5)
    : defaultStates.slice(0, 5);

  // console.log('Display Cities Debug:', {
  //   usingDefaultStates: !citiesData?.nearbyCities || citiesData.nearbyCities.length < 2,
  //   displayCitiesLength: displayCities.length,
  //   displayCities: displayCities,
  //   apiCitiesLength: citiesData?.nearbyCities?.length
  // });

  const isLoading = loading || citiesLoading;

  // Simplified loading states
  if (isLoading) return <div>Loading nearby cities...</div>;
  if (error || citiesError) {
    console.error('Error state:', { error, citiesError });
    return <div>Error loading nearby cities</div>;
  }

  // console.log('Display cities:', displayCities);
  // console.log('Number of cities to display:', displayCities.length);

  return (
    <div className="flex-1 flex-col gap-3">
      <h2 className="flex items-center gap-2 font-medium">
        {isLoading ? "Detecting your location..." : citiesData?.nearbyCities ? "Nearby Cities" : "Default Cities"}
      </h2>
      <div className="flex mt-3 flex-col gap-4">
        {isLoading ? (
          <p className="px-6 py-4">Loading cities...</p>
        ) : (
          displayCities.map((city: { lat: number; lon: number; name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode; distance: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode; state: any; country: any; }, index: Key) => (
            <div
              key={index}
              className="border rounded-lg cursor-pointer dark:bg-dark-grey shadow-sm dark:shadow-none"
              onClick={() => getClickedCityCords(city.lat, city.lon)}
            >
              <div className="px-6 py-4 flex">
                <p className="font-medium">{city.name}</p>
                {city.distance && (
                  <p className="text-sm text-gray-500 ml-4 mt-[0.17rem] ">
                    {city.distance} km away
                    {city.state && ` • ${city.state}`}
                    {city.country && ` • ${city.country}`}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
        {error && <p className="text-red-500">Error loading location data. Showing default cities.</p>}
      </div>
    </div>
  );
}

export default Topcities;