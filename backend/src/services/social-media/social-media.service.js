const cache = require('../../utils/cache');

const generateRealisticPosts = (disasterType, location) => {
  const templates = {
    flood: [
      `#floodrelief Urgent need for clean water and non-perishable food in {location}. Many families affected.`,
      `Major roads around {location} are completely submerged. Avoid the area. #flooding #emergencyalert`,
      `A temporary shelter has been set up at the {location} community center. Pets are welcome. #disasterrelief #community`,
    ],
    earthquake: [
      `Reports of significant structural damage to buildings in downtown {location} after the quake. #earthquake #aftershock`,
      `Emergency services are overwhelmed. Requesting volunteer medical personnel to report to the triage center at {location} stadium. #help #911`,
      `Multiple aftershocks felt in {location}. Stay clear of damaged structures. Find open ground. #safety #quake`,
    ],
    wildfire: [
        `#wildfire is spreading rapidly near {location}. Evacuation orders are now in effect for all residents north of the highway.`,
        `Air quality in {location} is hazardous. Stay indoors and keep windows closed. #smoke #healthalert`,
        `An animal rescue shelter is being set up at the {location} county fairgrounds for displaced pets. #animalrescue #fire`,
    ]
  };

  const postTemplate = templates[disasterType] || templates.flood; // Default to flood
  
  return postTemplate.map((template, index) => ({
    id: `post-${Date.now()}-${index}`,
    content: template.replace('{location}', location),
    user: `eyewitness${Math.floor(Math.random() * 100)}`,
    timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(), // Random time in last 24h
    engagement: {
      retweets: Math.floor(Math.random() * 500),
      likes: Math.floor(Math.random() * 2000),
    }
  }));
};

const getMockSocialMedia = async (disaster) => {
    const cacheKey = `social-media_${disaster.id}`;
    
    return cache.getOrFetch(cacheKey, async () => {
        // Use the first tag as the disaster type for template selection
        const disasterType = disaster.tags && disaster.tags.length > 0 ? disaster.tags[0] : 'flood';
        return generateRealisticPosts(disasterType, disaster.location_name);
    }, 60 * 5); // Cache for 5 minutes
};

module.exports = {
  getMockSocialMedia,
};
