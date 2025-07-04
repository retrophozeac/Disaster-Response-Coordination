const express = require('express');
// This router will be nested under the disasters router
const router = express.Router({ mergeParams: true }); 
const reportsController = require('./reports.controller');
const { authenticate, authorize } = require('../../middleware/auth');

// Apply authentication middleware to all routes
router.use(authenticate);

// Define the routes relative to /api/disasters/:disasterId/reports
router.post('/', authorize(['admin', 'contributor']), reportsController.createReport);
router.get('/', reportsController.getReportsByDisaster);

module.exports = router;
