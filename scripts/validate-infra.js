const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const Ably = require('ably');
// Load .env.local manually for the script
const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    const value = valueParts.join('=').trim();
    process.env[key.trim()] = value;
  }
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const ablyKey = process.env.ABLY_API_KEY;

async function validateSupabase() {
  console.log('\n--- [Stage 1: Supabase Validation] ---');
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials in .env.local');
    return false;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // Ping Supabase API via a simple query
    // Even if 'rooms' doesn't exist, a response from PostgREST confirms connectivity
    const { data, error, status } = await supabase.from('rooms').select('id').limit(1);
    
    if (error) {
      // Any response from PostgREST confirms the URL and Key are valid.
      // We specifically look for "relation does not exist" or "Could not find the table"
      const isReachable = error.code === 'PGRST116' || 
                        error.message.includes('relation "rooms" does not exist') ||
                        error.message.includes('Could not find the table');
      
      if (isReachable) {
        console.log('✅ Supabase reached! (Database responded: Table "rooms" not yet initialized).');
        return true;
      } else {
        console.error('❌ Supabase error:', error.message);
        return false;
      }
    }
    console.log('✅ Supabase connected and table "rooms" exists.');
    return true;
  } catch (err) {
    console.error('❌ Unexpected Supabase error:', err.message);
    return false;
  }
}

async function validateAbly() {
  console.log('\n--- [Stage 2: Ably Validation] ---');
  if (!ablyKey) {
    console.error('❌ Missing ABLY_API_KEY in .env.local');
    return false;
  }

  try {
    const ably = new Ably.Rest(ablyKey);
    const time = await ably.time();
    console.log(`✅ Ably reachable! Current Ably server time: ${new Date(time).toISOString()}`);
    
    // Test publish capability
    const channel = ably.channels.get('infrastructure-validation');
    await channel.publish('health-check', { timestamp: Date.now(), status: 'OK' });
    console.log('✅ Ably publish test successful!');
    return true;
  } catch (err) {
    console.error('❌ Ably validation error:', err.message);
    return false;
  }
}

async function runAudit() {
  console.log('SUMA Infrastructure Audit Starting...');
  const supabaseOk = await validateSupabase();
  const ablyOk = await validateAbly();
  
  console.log('\n--- [Audit Summary] ---');
  console.log(`Supabase: ${supabaseOk ? 'PASSED ✅' : 'FAILED ❌'}`);
  console.log(`Ably:     ${ablyOk ? 'PASSED ✅' : 'FAILED ❌'}`);
  
  if (supabaseOk && ablyOk) {
    console.log('\n🚀 ALL SYSTEMS NOMINAL. INFRASTRUCTURE SETUP COMPLETED.');
  } else {
    console.log('\n⚠️ SOME SYSTEMS FAILED. REVIEW LOGS ABOVE.');
    process.exit(1);
  }
}

runAudit();
