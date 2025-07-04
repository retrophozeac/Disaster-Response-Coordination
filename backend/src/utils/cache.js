const supabase = require('./supabaseClient');
const TABLE_NAME = 'cache';

const get = async (key) => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('value, expires_at')
    .eq('key', key)
    .single();

  if (error && error.code !== 'PGRST116') { // Ignore 'no rows found' error
    console.error(`Error fetching cache for key ${key}:`, error);
    return null;
  }

  if (data && new Date(data.expires_at) > new Date()) {
    return data.value;
  }

  return null;
};

const set = async (key, value, ttlSeconds = 3600) => {
  const expires_at = new Date(Date.now() + ttlSeconds * 1000);
  const { error } = await supabase
    .from(TABLE_NAME)
    .upsert({ key, value, expires_at }, { onConflict: 'key' });

  if (error) {
    console.error(`Error setting cache for key ${key}:`, error);
  }
};

const getOrFetch = async (key, fetchFunction, ttlSeconds = 3600) => {
    const cachedValue = await get(key);
    if (cachedValue !== null) {
      return cachedValue;
    }
  
    const freshData = await fetchFunction();
    if (freshData !== null && freshData !== undefined) {
      await set(key, freshData, ttlSeconds);
    }
  
    return freshData;
  };

module.exports = {
  get,
  set,
  getOrFetch,
};
