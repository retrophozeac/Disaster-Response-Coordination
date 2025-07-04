const resourcesService = require('./resources.service');
const geocodingService = require('../geocoding/geocoding.service');
const { getIO } = require('../../websockets/socket');

const createResource = async (req, res) => {
  try {
    const { location_name } = req.body;

    if (!location_name) {
        return res.status(400).json({ message: 'location_name is required' });
    }

    const geocodedData = await geocodingService.processLocation(location_name);

    if (!geocodedData) {
        return res.status(400).json({ message: 'Could not geocode the provided location_name' });
    }

    const resourceData = { 
      ...req.body, 
      disaster_id: req.params.disasterId,
      location: geocodedData.geography,
    };
    
    const newResource = await resourcesService.createResource(resourceData);
    
    // Notify the specific disaster room about the new resource
    getIO().to(req.params.disasterId).emit('resource_created', newResource);

    res.status(201).json(newResource);
  } catch (error) {
    res.status(500).json({ message: 'Error creating resource', error: error.message });
  }
};

const getResourcesByDisaster = async (req, res) => {
  try {
    const resources = await resourcesService.getResourcesByDisaster(req.params.disasterId);
    res.status(200).json(resources);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching resources', error: error.message });
  }
};

const findNearbyResources = async (req, res) => {
    const { lat, lon, radius } = req.query;
  
    if (!lat || !lon) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }
  
    try {
      const resources = await resourcesService.findNearbyResources(parseFloat(lat), parseFloat(lon), radius ? parseInt(radius) : undefined);
      res.status(200).json(resources);
    } catch (error) {
      res.status(500).json({ message: 'Error finding nearby resources', error: error.message });
    }
  };

module.exports = {
  createResource,
  getResourcesByDisaster,
  findNearbyResources,
};
