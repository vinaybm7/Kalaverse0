import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Get the correct redirect URL based on environment
const getRedirectURL = () => {
  // In production, use the production URL
  if (import.meta.env.PROD) {
    return 'https://kalaverse0.vercel.app';
  }
  
  // In development, use localhost
  return 'http://localhost:5173';
};

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    redirectTo: getRedirectURL()
  }
});

// Helper function to get auth redirect URL for specific actions
export const getAuthRedirectURL = (path: string = '') => {
  const baseURL = getRedirectURL();
  return `${baseURL}${path}`;
};