const reportsService = require('./reports.service');
const { getIO } = require('../../websockets/socket');
const verifyImage = require('../verification/verification.service').verifyImage;

const createReport = async (req, res) => {
  try {
    const reportData = { 
      ...req.body, 
      user_id: req.user.id,
      disaster_id: req.params.disasterId,
    };
    // Verify the image if provided
    if (reportData.image_url) {
      console.log('Verifying image:', reportData.image_url);
      const verificationResult = await verifyImage(reportData.image_url);
      reportData.verification_status = verificationResult["authentic"];
    }
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

const verifyReport = async (req, res) => {
  try {
    const reportId = req.params.reportId;
    const updatedReport = await reportsService.verifyReport(reportId);
    
    // Notify the specific disaster room about the verified report
    getIO().to(req.params.disasterId).emit('report_verified', updatedReport);

    res.status(200).json(updatedReport);
  } catch (error) {
    res.status(500).json({ message: 'Error verifying report', error: error.message });
  }
};

module.exports = {
  createReport,
  getReportsByDisaster,
  verifyReport
};
