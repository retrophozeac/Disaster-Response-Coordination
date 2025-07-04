const socialMediaService = require('./social-media.service');
const disasterService = require('../disaster/disaster.service');

const getSocialMediaFeed = async (req, res) => {
  try {
    const disaster = await disasterService.getDisasterById(req.params.disasterId);
    if (!disaster) {
      return res.status(404).json({ message: 'Disaster not found' });
    }

    const feed = await socialMediaService.getMockSocialMedia(disaster);
    res.status(200).json(feed);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching social media feed', error: error.message });
  }
};

module.exports = {
  getSocialMediaFeed,
};
