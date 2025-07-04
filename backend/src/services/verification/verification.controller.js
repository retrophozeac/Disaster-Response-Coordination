const verificationService = require('./verification.service');

async function verifyImage(req, res) {
  const { imageUrl } = req.body;
  if (!imageUrl) {
    return res.status(400).json({ message: 'imageUrl is required' });
  }

  try {
    const result = await verificationService.verifyImage(imageUrl);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  verifyImage,
};
