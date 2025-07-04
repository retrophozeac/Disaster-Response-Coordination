const express = require('express');
const router = express.Router({ mergeParams: true });
const resourcesController = require('./resources.controller');
const { authenticate, authorize } = require('../../middleware/auth');

// This router is already authenticated from the disaster router

// Define the routes relative to /api/disasters/:disasterId/resources
router.post('/', authorize(['admin', 'contributor']), resourcesController.createResource);
router.get('/', resourcesController.getResourcesByDisaster);

// A separate route for finding nearby resources, not nested under a specific disaster
const nearbyRouter = express.Router();
nearbyRouter.use(authenticate);
nearbyRouter.post('/', resourcesController.findNearbyResources);

module.exports = {
    disasterResourcesRouter: router,
    nearbyResourcesRouter: nearbyRouter,
};
