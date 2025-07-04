const express = require('express');
const router = express.Router({ mergeParams: true });
const socialMediaController = require('./social-media.controller');

// This router is already authenticated from the disaster router

router.get('/', socialMediaController.getSocialMediaFeed);

module.exports = router;
