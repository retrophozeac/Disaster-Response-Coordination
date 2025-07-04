const express = require('express');
const router = express.Router();
const updatesController = require('./updates.controller');

router.get('/', updatesController.getUpdates);

module.exports = router;
