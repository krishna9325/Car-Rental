// contexts/CarsContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const CarsContext = createContext();

export const useCars = () => {
  const context = useContext(CarsContext);
  if (!context) {
    throw new Error("useCars must be used within a CarsProvider");
  }
  return context;
};

export const CarsProvider = ({ children }) => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  // Cache duration in milliseconds (5 minutes)
  const CACHE_DURATION = 5 * 60 * 1000;

  const fetchCities = async (forceRefresh = false) => {
    // Check if we need to fetch (no data, force refresh, or cache expired)
    const now = Date.now();
    // const cacheExpired = !lastFetch || (now - lastFetch) > CACHE_DURATION;

    // if (!forceRefresh && cities.length > 0 && !cacheExpired) {
    //   return cities;
    // }

    try {
      setLoading(true);
      setError(null);
      console.log(`${API_BASE_URL}/cars/public/cities`);
      const response = await fetch(`http://localhost:8080/cars/public/cities`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCities(data);
      setLastFetch(now);
      setLoading(false);

      return data;
    } catch (err) {
      console.error("Error fetching cities:", err);
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchCities();
  }, []);

  // Helper function to get all cars with city info
  const getAllCars = () => {
    return cities.flatMap((city) =>
      city.cars.map((car) => ({ ...car, cityName: city.cityName }))
    );
  };

  // Helper function to get cars by city
  const getCarsByCity = (cityId) => {
    if (cityId === "all") {
      return getAllCars();
    }

    const selectedCity = cities.find((city) => city.id.toString() === cityId);

    if (!selectedCity) {
      return [];
    }

    return selectedCity.cars.map((car) => ({
      ...car,
      cityName: selectedCity.cityName,
    }));
  };

  const value = {
    cities,
    loading,
    error,
    lastFetch,
    fetchCities,
    getAllCars,
    getCarsByCity,
  };

  return <CarsContext.Provider value={value}>{children}</CarsContext.Provider>;
};
