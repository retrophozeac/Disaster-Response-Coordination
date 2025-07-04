const express = require('express');
const router = express.Router();
const disasterController = require('./disaster.controller');
const { authenticate, authorize } = require('../../middleware/auth');
const reportsRouter = require('../reports/reports.router');
const { disasterResourcesRouter } = require('../resources/resources.router');
const socialMediaRouter = require('../social-media/social-media.router');

// Apply authentication middleware to all routes
router.use(authenticate);

// Nest the reports, resources, and social media routers
router.use('/:disasterId/reports', reportsRouter);
router.use('/:disasterId/resources', disasterResourcesRouter);
router.use('/:disasterId/social-media', socialMediaRouter);

// Define the routes
router.post('/', authorize(['admin', 'contributor']), disasterController.createDisaster);
router.get('/', disasterController.getDisasters);
router.get('/:id', disasterController.getDisasterById);
router.put('/:id', authorize(['admin', 'contributor']), disasterController.updateDisaster);
router.delete('/:id', authorize(['admin']), disasterController.deleteDisaster);

module.exports = router;
