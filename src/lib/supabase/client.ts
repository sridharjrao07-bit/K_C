
import { createBrowserClient } from '@supabase/ssr'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

if (url.includes('placeholder') && typeof window !== 'undefined') {
    console.error('CRITICAL: Supabase keys are missing! Authentication will fail.');
}

return createBrowserClient(url, key)
}
