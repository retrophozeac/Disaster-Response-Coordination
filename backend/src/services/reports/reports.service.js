const supabase = require('../../utils/supabaseClient');
const TABLE_NAME = 'reports';

const createReport = async (reportData) => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert([reportData])
    .select();
  
  if (error) {
    console.error('Error creating report:', error);
    throw new Error(error.message);
  }
  
  return data[0];
};

const getReportsByDisaster = async (disasterId) => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('disaster_id', disasterId);

  if (error) {
    console.error(`Error fetching reports for disaster ${disasterId}:`, error);
    throw new Error(error.message);
  }

  return data;
};

const verifyReport = async (reportId) => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update(verification_status,'verified')
    .eq('id', reportId)
    .select();

  if (error) {
    console.error(`Error verifying report ${reportId}:`, error);
    throw new Error(error.message);
  }

  return data[0];
};

module.exports = {
  createReport,
  getReportsByDisaster,
  verifyReport,
};
