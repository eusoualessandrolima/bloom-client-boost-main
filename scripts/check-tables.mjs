// Script to test Supabase connection and check if tables exist
const SUPABASE_URL = 'https://tdnbiyiukgcurwfliuxl.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkbmJpeWl1a2djdXJ3ZmxpdXhsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Nzk5MTQ1NywiZXhwIjoyMDgzNTY3NDU3fQ.2u-k-7eY4_mNpOH03ml8jw5g7nIGegk3pNSdUQPS9Ds';

async function checkTables() {
    try {
        console.log('Checking Supabase connection...');

        // Check if profiles table exists
        const profilesRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles?select=id&limit=1`, {
            headers: {
                'apikey': SERVICE_ROLE_KEY,
                'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
            }
        });

        console.log('Profiles table status:', profilesRes.status);
        if (profilesRes.status === 200) {
            console.log('✅ Profiles table EXISTS');
        } else if (profilesRes.status === 404) {
            console.log('❌ Profiles table NOT FOUND');
        } else {
            const text = await profilesRes.text();
            console.log('Profiles response:', text);
        }

        // Check if clients table exists
        const clientsRes = await fetch(`${SUPABASE_URL}/rest/v1/clients?select=id&limit=1`, {
            headers: {
                'apikey': SERVICE_ROLE_KEY,
                'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
            }
        });

        console.log('Clients table status:', clientsRes.status);
        if (clientsRes.status === 200) {
            console.log('✅ Clients table EXISTS');
        } else if (clientsRes.status === 404) {
            console.log('❌ Clients table NOT FOUND');
        } else {
            const text = await clientsRes.text();
            console.log('Clients response:', text);
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
}

checkTables();
