const axios = require('axios');
const logger = require('../shared/utils/logger');

/**
 * Geocoding Service to fetch Latitude and Longitude.
 * In production, replace with Google Maps API or Nominatim.
 */
const getCoordinates = async (address, city, pincode) => {
  try {
    const fullAddress = `${address}, ${city}, ${pincode}, India`;
    logger.info(`Geocoding address: ${fullAddress}`);

    // Mocking for now: Returns random Mumbai coordinates if no API key is present
    const lat = 19.0760 + (Math.random() - 0.5) * 0.1;
    const lng = 72.8777 + (Math.random() - 0.5) * 0.1;

    return { latitude: lat.toFixed(6), longitude: lng.toFixed(6) };
  } catch (error) {
    logger.error('Geocoding failed:', error);
    return null;
  }
};

module.exports = { getCoordinates };
