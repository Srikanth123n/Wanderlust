const NodeGeocoder = require("node-geocoder");

// Configure geocoder to use free OpenStreetMap Nominatim service
const options = {
  provider: "openstreetmap",
  httpAdapter: "https",
  formatter: null,
};

const geocoder = NodeGeocoder(options);

/**
 * Get coordinates from a location string
 * @param {string} location - Location string (e.g., "Paris, France")
 * @returns {Promise<{type: string, coordinates: number[]}>} GeoJSON Point
 */
async function getCoordinates(location) {
  try {
    const res = await geocoder.geocode(location);
    
    if (res && res.length > 0) {
      const { latitude, longitude } = res[0];
      return {
        type: "Point",
        coordinates: [longitude, latitude], // GeoJSON format: [lng, lat]
      };
    }
    
    // Fallback to default coordinates if geocoding fails
    console.warn(`Geocoding failed for "${location}", using default coordinates`);
    return {
      type: "Point",
      coordinates: [0, 0],
    };
  } catch (error) {
    console.error("Geocoding error:", error.message);
    // Return default coordinates on error
    return {
      type: "Point",
      coordinates: [0, 0],
    };
  }
}

module.exports = { getCoordinates };
