const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Faltan las variables de entorno SUPABASE_URL y SUPABASE_ANON_KEY');
}

// Cliente público (para operaciones del frontend)
const supabase = createClient(supabaseUrl, supabaseKey);

// Cliente de servicio (para operaciones del backend con permisos administrativos)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

module.exports = { supabase, supabaseAdmin };