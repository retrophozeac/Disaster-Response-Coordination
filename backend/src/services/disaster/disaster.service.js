const supabase = require('../../utils/supabaseClient');

const TABLE_NAME = 'disasters';

const createDisaster = async (disasterData) => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert([disasterData])
    .select();
  
  if (error) {
    console.error('Error creating disaster:', error);
    throw new Error(error.message);
  }
  
  return data[0];
};

const getDisasters = async (filters = {}) => {
  let query = supabase.from(TABLE_NAME).select('*');

  if (filters.tag) {
    query = query.contains('tags', [filters.tag]);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching disasters:', error);
    throw new Error(error.message);
  }

  return data;
};

const getDisasterById = async (id) => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') { // PostgREST error for no rows found
      return null;
    }
    console.error(`Error fetching disaster with id ${id}:`, error);
    throw new Error(error.message);
  }

  return data;
};

const updateDisaster = async (id, updateData) => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update(updateData)
    .eq('id', id)
    .select();

  if (error) {
    console.error(`Error updating disaster with id ${id}:`, error);
    throw new Error(error.message);
  }

  return data[0];
};

const deleteDisaster = async (id) => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting disaster with id ${id}:`, error);
    throw new Error(error.message);
  }

  return data;
};

module.exports = {
  createDisaster,
  getDisasters,
  getDisasterById,
  updateDisaster,
  deleteDisaster,
};
