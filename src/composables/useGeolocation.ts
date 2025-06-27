import { ref, reactive } from 'vue';
import type { UserLocation } from '../types';

export function useGeolocation() {
  const location = ref<UserLocation | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const getCurrentLocation = async (): Promise<UserLocation | null> => {
    loading.value = true;
    error.value = null;

    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocalización no soportada por el navegador');
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        });
      });

      const userLocation: UserLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };

      // Obtener información de la ciudad usando reverse geocoding (simulado)
      try {
        const cityInfo = await reverseGeocode(userLocation.latitude, userLocation.longitude);
        userLocation.city = cityInfo.city;
        userLocation.country = cityInfo.country;
      } catch (e) {
        console.warn('No se pudo obtener información de la ciudad:', e);
      }

      location.value = userLocation;
      return userLocation;
    } catch (err: any) {
      error.value = err.message || 'Error al obtener la ubicación';
      return null;
    } finally {
      loading.value = false;
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const reverseGeocode = async (lat: number, lon: number) => {
    // Simulación de reverse geocoding - en producción usarías una API real
    const cities = [
      { name: 'Fresnillo', country: 'Mexico', lat: 40.4168, lon: -3.7038 },
      { name: 'Zacatecas', country: 'Mexico', lat: 41.3851, lon: 2.1734 },
      { name: 'Jerez', country: 'Mexico', lat: 39.4699, lon: -0.3763 },
      { name: 'Calera', country: 'Mexico', lat: 37.3891, lon: -5.9845 },
      { name: 'Sombrerete', country: 'Mexico', lat: 43.2627, lon: -2.9253 }
    ];

    let closestCity = cities[0];
    let minDistance = calculateDistance(lat, lon, cities[0].lat, cities[0].lon);

    cities.forEach(city => {
      const distance = calculateDistance(lat, lon, city.lat, city.lon);
      if (distance < minDistance) {
        minDistance = distance;
        closestCity = city;
      }
    });

    return {
      city: closestCity.name,
      country: closestCity.country
    };
  };

  return {
    location,
    loading,
    error,
    getCurrentLocation,
    calculateDistance
  };
}