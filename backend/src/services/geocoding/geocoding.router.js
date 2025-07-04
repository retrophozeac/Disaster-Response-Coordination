const express = require('express');
const router = express.Router();
const geocodingController = require('./geocoding.controller');
const { authenticate } = require('../../middleware/auth');

// Apply authentication middleware to all routes
router.use(authenticate);

// Define the routes
router.post('/', geocodingController.geocodeDescription);

module.exports = router;
