const reportsService = require('./reports.service');
const { getIO } = require('../../websockets/socket');

const createReport = async (req, res) => {
  try {
    const reportData = { 
      ...req.body, 
      user_id: req.user.id,
      disaster_id: req.params.disasterId,
    };
    const newReport = await reportsService.createReport(reportData);
    
    // Notify the specific disaster room about the new report
    getIO().to(req.params.disasterId).emit('report_created', newReport);

    res.status(201).json(newReport);
  } catch (error) {
    res.status(500).json({ message: 'Error creating report', error: error.message });
  }
};

const getReportsByDisaster = async (req, res) => {
  try {
    const reports = await reportsService.getReportsByDisaster(req.params.disasterId);
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reports', error: error.message });
  }
};

module.exports = {
  createReport,
  getReportsByDisaster,
};
