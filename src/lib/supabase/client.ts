
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Safe Debugging: Check what Vercel is actually seeing
    if (typeof window !== 'undefined') {
        console.log('🔍 DEBUG: Checking Supabase Connection...');
        console.log('   URL:', url ? url.substring(0, 15) + '...' : 'UNDEFINED');
        // Do NOT log the full key, just check if it exists
        console.log('   KEY Exists?', !!key);
        console.log('   KEY Length:', key ? key.length : 0);
    }

    if (!url || url.includes('placeholder')) {
        console.error('CRITICAL: Supabase keys are missing or placeholder! Authentication will fail.');
        return createBrowserClient('https://placeholder.supabase.co', 'placeholder');
    }

    return createBrowserClient(url, key!)
}
