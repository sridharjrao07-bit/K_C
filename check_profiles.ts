
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProfiles() {
  const { data, error } = await supabase
    .from('profiles')
    .select('full_name, craft')
    .not('craft', 'is', null);

  if (error) console.error(error);
  else {
    console.log('Profiles Found:', data?.length);
    data?.forEach(p => console.log(`- ${p.full_name} (${p.craft})`));
  }
}

checkProfiles();
