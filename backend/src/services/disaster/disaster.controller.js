const disasterService = require('./disaster.service');
const { getIO } = require('../../websockets/socket');

const createDisaster = async (req, res) => {
  try {
    const disasterData = { ...req.body, owner_id: req.user.id };
    const newDisaster = await disasterService.createDisaster(disasterData);
    // Broadcast to a general 'disasters' room for list updates
    getIO().emit('disaster_created', newDisaster);
    res.status(201).json(newDisaster);
  } catch (error) {
    res.status(500).json({ message: 'Error creating disaster', error: error.message });
  }
};

const getDisasters = async (req, res) => {
  try {
    const disasters = await disasterService.getDisasters(req.query);
    res.status(200).json(disasters);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching disasters', error: error.message });
  }
};

const getDisasterById = async (req, res) => {
  try {
    const disaster = await disasterService.getDisasterById(req.params.id);
    if (!disaster) {
      return res.status(404).json({ message: 'Disaster not found' });
    }
    res.status(200).json(disaster);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching disaster', error: error.message });
  }
};

const updateDisaster = async (req, res) => {
  try {
    const disaster = await disasterService.getDisasterById(req.params.id);
    if (!disaster) {
      return res.status(404).json({ message: 'Disaster not found' });
    }
    // In a real app, you'd have more robust ownership/permission checks here
    if (disaster.owner_id !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: You do not own this resource' });
    }

    const updatedDisaster = await disasterService.updateDisaster(req.params.id, req.body);
    // Broadcast to the specific disaster room
    getIO().to(req.params.id).emit('disaster_updated', updatedDisaster);
    // Also broadcast to the general list
    getIO().emit('disaster_list_updated', updatedDisaster);
    res.status(200).json(updatedDisaster);
  } catch (error) {
    res.status(500).json({ message: 'Error updating disaster', error: error.message });
  }
};

const deleteDisaster = async (req, res) => {
  try {
    const disaster = await disasterService.getDisasterById(req.params.id);
    if (!disaster) {
      return res.status(404).json({ message: 'Disaster not found' });
    }
    if (disaster.owner_id !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: You do not own this resource' });
    }

    const disasterId = req.params.id;
    await disasterService.deleteDisaster(disasterId);
    // Broadcast to the specific disaster room that it's deleted
    getIO().to(disasterId).emit('disaster_deleted', { id: disasterId });
    // Also broadcast to the general list
    getIO().emit('disaster_list_deleted', { id: disasterId });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting disaster', error: error.message });
  }
};

module.exports = {
  createDisaster,
  getDisasters,
  getDisasterById,
  updateDisaster,
  deleteDisaster,
};
