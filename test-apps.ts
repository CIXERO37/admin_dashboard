import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data, error } = await supabase.from('game_sessions').select('application').eq('status', 'finished');
  if (error) {
    console.error(error);
    return;
  }
  const sessionsByApp: Record<string, number> = {};
  data.forEach(session => {
    let app = session.application || "";
    app = app.trim().replace(/\.com$/i, "").toUpperCase(); // Clean app name
    if (!app) app = "UNKNOWN";
    sessionsByApp[app] = (sessionsByApp[app] || 0) + 1;
  });
  
  const appDistributionData = Object.entries(sessionsByApp).map(([name, value]) => ({
    name,
    value
  })).sort((a, b) => b.value - a.value);
  console.log(appDistributionData);
}
main();
