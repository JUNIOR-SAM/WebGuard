import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const getProfile = async (userId) => {
  const { data } = await supabase
    .from('profiles')
    .select('full_name, email')
    .eq('id', userId)
    .single();
  return data;
};

export const ensureProfile = async (user) => {
  const existing = await getProfile(user.id);
  
  if (!existing?.full_name) {
    const name = user.user_metadata?.full_name || 
                 user.user_metadata?.name || 
                 user.email?.split('@')[0] || 'User';
                 
    await supabase.from('profiles').upsert({
      id: user.id,
      full_name: name,
      email: user.email
    });
    return name;
  }
  return existing.full_name;
};