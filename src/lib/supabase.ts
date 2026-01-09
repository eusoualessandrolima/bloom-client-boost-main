import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tdnbiyiukgcurwfliuxl.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkbmJpeWl1a2djdXJ3ZmxpdXhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5OTE0NTcsImV4cCI6MjA4MzU2NzQ1N30.AJ6DQnwhVs5s01VulpXPZ9GTrUGHCBDoXWN0lFd6rnE';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
    }
});
