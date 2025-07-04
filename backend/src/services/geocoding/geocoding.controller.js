const geocodingService = require('./geocoding.service');

const geocodeDescription = async (req, res) => {
  const { description } = req.body;

  if (!description) {
    return res.status(400).json({ message: 'Description is required' });
  }

  try {
    const result = await geocodingService.processLocation(description);
    if (!result) {
      return res.status(404).json({ message: 'Could not determine location from description' });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error processing location', error: error.message });
  }
};

module.exports = {
  geocodeDescription,
};
