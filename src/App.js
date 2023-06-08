import React, { useState, useEffect } from 'react';

const LocationComponent = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [city, setCity] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        if (typeof latitude === 'number' && typeof longitude === 'number') {
          setLocation({ latitude, longitude });
          getCityName(latitude, longitude);
        } else {
          setError("Error: Invalid coordinates");
        }
      }, (error) => {
        console.warn("Error: ", error);
        setError("Error getting location");
      });
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  const getCityName = async (latitude, longitude) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
      const data = await response.json();

      if (data.address && data.address.city) {
        setCity(data.address.city);
      } else if (data.address && data.address.town) {
        setCity(data.address.town);
      } else if (data.address && data.address.village) {
        setCity(data.address.village);
      }
    } catch (error) {
      console.error("Error retrieving city name: ", error);
      setError("Error retrieving city name");
    }
  };

  return (
    <div>
      {error ? <p>{error}</p> :
        location ? (
          <div>
            {/* <p>Your location is  Latitude: {location.latitude}, Longitude: {location.longitude}</p> */}
            {city && <p>Your city is: {city}</p>}
          </div>
        ) : <p>Loading...</p>}
    </div>
  );
};

export default LocationComponent;
