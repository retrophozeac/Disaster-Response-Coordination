const { createClient } = require('@supabase/supabase-js');
// Correct the path to the .env file, which is in the parent directory
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase URL or Anon Key is missing. Make sure they are defined in the backend/.env file.");
  throw new Error('Supabase URL and Anon Key must be defined in the .env file');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
