import axios from "axios";
import React, { useContext, createContext, useState, useEffect } from "react";

const GlobalContext = createContext();
const GlobalContextUpdate = createContext();

export const GlobalContextProvider = ({ children }) => {
  const geolocationUrl = 'https://api.geoapify.com/v1/ipinfo?&apiKey=f9e1b444125a42409c1941f6b2a15d18';
  const [activeCityCoords, setActiveCityCoords] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Data states
  const [forecast, setForecast] = useState({});
  const [airQuality, setAirQuality] = useState({});
  const [fiveDayForecast, setFiveDayForecast] = useState({});
  const [uvIndex, setUvIndex] = useState({});
  
  // Cache status trackers
  const [cacheStatus, setCacheStatus] = useState({
    forecast: null,
    airQuality: null,
    fiveDayForecast: null,
    uvIndex: null
  });

  console.log('🚀 GlobalContext Provider initialized');

  // Get initial user location
  useEffect(() => {
    console.log('📍 Fetching user location...');
    fetch(geolocationUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.location) {
          console.log(`✅ Location found: [${data.location.latitude}, ${data.location.longitude}]`);
          setActiveCityCoords([data.location.latitude, data.location.longitude]);
        }
      })
      .catch((error) => {
        console.error('❌ Error fetching location data:', error);
        console.log('🔄 Falling back to London coordinates');
        // Default to London coordinates
        setActiveCityCoords([51.5074, -0.1278]);
      })
      .finally(() => {
        setIsLoading(false);
        console.log('🏁 Location loading complete');
      });
  }, []); 

  const fetchForecast = async (lat, lon) => {
    console.log(`🌤️ Fetching weather forecast for [${lat}, ${lon}]...`);
    try {
      const res = await axios.get(`/api/weather?lat=${lat}&lon=${lon}`);
      setForecast(res.data);
      // Check if data came from cache
      const cacheHit = res.headers['x-cache'] === 'HIT';
      console.log(`${cacheHit ? '🎯 CACHE HIT' : '🔄 CACHE MISS'} for weather forecast`);
      setCacheStatus(prev => ({ ...prev, forecast: cacheHit ? 'HIT' : 'MISS' }));
      return res.data;
    } catch (error) {
      console.log("❌ Error fetching forecast data: ", error.message);
      setCacheStatus(prev => ({ ...prev, forecast: 'ERROR' }));
    }
  };

  const fetchAirQuality = async (lat, lon) => {
    console.log(`💨 Fetching air quality for [${lat}, ${lon}]...`);
    try {
      const res = await axios.get(`/api/pollution?lat=${lat}&lon=${lon}`);
      setAirQuality(res.data);
      const cacheHit = res.headers['x-cache'] === 'HIT';
      console.log(`${cacheHit ? '🎯 CACHE HIT' : '🔄 CACHE MISS'} for air quality`);
      setCacheStatus(prev => ({ ...prev, airQuality: cacheHit ? 'HIT' : 'MISS' }));
      return res.data;
    } catch (error) {
      console.log("❌ Error fetching air quality data: ", error.message);
      setCacheStatus(prev => ({ ...prev, airQuality: 'ERROR' }));
    }
  };

  const fetchFiveDayForecast = async (lat, lon) => {
    console.log(`📅 Fetching 5-day forecast for [${lat}, ${lon}]...`);
    try {
      const res = await axios.get(`/api/fiveday?lat=${lat}&lon=${lon}`);
      setFiveDayForecast(res.data);
      const cacheHit = res.headers['x-cache'] === 'HIT';
      console.log(`${cacheHit ? '🎯 CACHE HIT' : '🔄 CACHE MISS'} for 5-day forecast`);
      setCacheStatus(prev => ({ ...prev, fiveDayForecast: cacheHit ? 'HIT' : 'MISS' }));
      return res.data;
    } catch (error) {
      console.log("❌ Error fetching five day forecast data: ", error.message);
      setCacheStatus(prev => ({ ...prev, fiveDayForecast: 'ERROR' }));
    }
  };

  const fetchUvIndex = async (lat, lon) => {
    console.log(`☀️ Fetching UV index for [${lat}, ${lon}]...`);
    try {
      const res = await axios.get(`/api/uv?lat=${lat}&lon=${lon}`);
      setUvIndex(res.data);
      const cacheHit = res.headers['x-cache'] === 'HIT';
      console.log(`${cacheHit ? '🎯 CACHE HIT' : '🔄 CACHE MISS'} for UV index`);
      setCacheStatus(prev => ({ ...prev, uvIndex: cacheHit ? 'HIT' : 'MISS' }));
      return res.data;
    } catch (error) {
      console.error("❌ Error fetching the UV index:", error);
      setCacheStatus(prev => ({ ...prev, uvIndex: 'ERROR' }));
    }
  };

  // Force refresh data (bypass cache)
  const refreshAllData = async () => {
    if (!activeCityCoords) return;
    
    console.log('🔄 Manually refreshing all data...');
    const [lat, lon] = activeCityCoords;
    
    setCacheStatus({
      forecast: 'LOADING',
      airQuality: 'LOADING',
      fiveDayForecast: 'LOADING',
      uvIndex: 'LOADING'
    });
    
    await Promise.all([
      fetchForecast(lat, lon),
      fetchAirQuality(lat, lon),
      fetchFiveDayForecast(lat, lon),
      fetchUvIndex(lat, lon)
    ]);
    
    console.log('✅ Data refresh complete');
  };

  // Fetch all data when coordinates change
  useEffect(() => {
    if (activeCityCoords && !isLoading) {
      const [lat, lon] = activeCityCoords;
      
      console.log(`🔄 Fetching all data for coordinates [${lat}, ${lon}]...`);
      
      setCacheStatus({
        forecast: 'LOADING',
        airQuality: 'LOADING',
        fiveDayForecast: 'LOADING',
        uvIndex: 'LOADING'
      });
      
      Promise.all([
        fetchForecast(lat, lon),
        fetchAirQuality(lat, lon),
        fetchFiveDayForecast(lat, lon),
        fetchUvIndex(lat, lon)
      ]).then(() => {
        console.log('✅ All data fetched successfully');
        console.table({
          forecast: cacheStatus.forecast,
          airQuality: cacheStatus.airQuality,
          fiveDayForecast: cacheStatus.fiveDayForecast,
          uvIndex: cacheStatus.uvIndex
        });
      });
    }
  }, [activeCityCoords, isLoading]);

  // Log cache status changes
  useEffect(() => {
    if (!isLoading) {
      console.log('🔍 Cache status updated:');
      console.table(cacheStatus);
    }
  }, [cacheStatus]);

  return (
    <GlobalContext.Provider
      value={{
        forecast,
        airQuality,
        fiveDayForecast,
        uvIndex,
        activeCityCoords,
        isLoading,
        cacheStatus
      }}
    >
      <GlobalContextUpdate.Provider
        value={{
          setActiveCityCoords,
          refreshAllData
        }}
      >
        {children}
      </GlobalContextUpdate.Provider>
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
export const useGlobalContextUpdate = () => useContext(GlobalContextUpdate);