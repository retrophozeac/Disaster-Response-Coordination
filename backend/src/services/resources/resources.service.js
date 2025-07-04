const supabase = require('../../utils/supabaseClient');
const TABLE_NAME = 'resources';

const createResource = async (resourceData) => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert([resourceData])
    .select();
  
  if (error) {
    console.error('Error creating resource:', error);
    throw new Error(error.message);
  }
  
  return data[0];
};

const getResourcesByDisaster = async (disasterId) => {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('disaster_id', disasterId);
  
    if (error) {
      console.error(`Error fetching resources for disaster ${disasterId}:`, error);
      throw new Error(error.message);
    }
  
    return data;
  };

const findNearbyResources = async (lat, lon, radius = 20000) => {
    const { data, error } = await supabase.rpc('find_nearby_resources', {
        lat,
        lon,
        radius
    });

    if (error) {
        console.error('Error finding nearby resources:', error);
        throw new Error(error.message);
    }

    return data;
};

module.exports = {
  createResource,
  getResourcesByDisaster,
  findNearbyResources,
};
