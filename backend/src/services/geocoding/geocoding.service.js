const geminiService = require('./gemini.service');
const nominatimService = require('./nominatim.service');

const processLocation = async (description) => {
  // Stage 1: Extract location name from description using Gemini
  const locationName = await geminiService.extractLocation(description);

  if (!locationName) {
    console.log(`No location found in description: "${description}"`);
    return null;
  }

  // Stage 2: Geocode the extracted location name using Nominatim
  const coordinates = await nominatimService.geocode(locationName);

  if (!coordinates) {
    console.log(`Could not geocode location: "${locationName}"`);
    return null;
  }

  return {
    locationName,
    coordinates,
    geography: `POINT(${coordinates.lon} ${coordinates.lat})`,
  };
};

module.exports = {
  processLocation,
};
