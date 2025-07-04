const updatesService = require('./updates.service');

async function getUpdates(req, res) {
  try {
    const updates = await updatesService.fetchUpdates();
    res.json(updates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getUpdates,
};
