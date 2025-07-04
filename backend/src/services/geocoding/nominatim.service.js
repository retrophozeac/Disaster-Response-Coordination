const axios = require('axios');
const cache = require('../../utils/cache');

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/search';

const geocode = async (locationName) => {
  const cacheKey = `geocode_${locationName.replace(/\s/g, '_')}`;

  return cache.getOrFetch(cacheKey, async () => {
    try {
      const response = await axios.get(NOMINATIM_BASE_URL, {
        params: {
          q: locationName,
          format: 'json',
          limit: 1,
        },
        headers: {
          'User-Agent': 'DisasterResponsePlatform/1.0 (dev@example.com)' // Nominatim requires a User-Agent
        }
      });

      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];
        return { lat: parseFloat(lat), lon: parseFloat(lon) };
      }

      return null;
    } catch (error) {
      console.error(`Error geocoding "${locationName}":`, error.message);
      return null;
    }
  }, 3600 * 24); // Cache geocoding results for 24 hours
};

module.exports = {
  geocode,
};
