import { createClient } from '@supabase/supabase-js';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

function getRequiredEnvVar(name: 'NEXT_PUBLIC_SUPABASE_URL' | 'NEXT_PUBLIC_SUPABASE_ANON_KEY' | 'SUPABASE_SERVICE_ROLE_KEY') {
  const value = process.env[name];

  if (!value) {
    console.error(`CRITICAL: Missing env var ${name}`);
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const getSupabase = () => {
  const supabaseUrl = getRequiredEnvVar('NEXT_PUBLIC_SUPABASE_URL');
  const supabaseAnonKey = getRequiredEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY');

  return createClient(supabaseUrl, supabaseAnonKey);
};

export const getSupabaseAdmin = () => {
  const supabaseUrl = getRequiredEnvVar('NEXT_PUBLIC_SUPABASE_URL');
  const serviceRoleKey = getRequiredEnvVar('SUPABASE_SERVICE_ROLE_KEY');

  return createClient(supabaseUrl, serviceRoleKey);
};

export const verifyAdminSession = async () => {
  const cookieStore = cookies();
  const supabase = createServerClient(
    getRequiredEnvVar('NEXT_PUBLIC_SUPABASE_URL'),
    getRequiredEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Safe to ignore inside Server Actions/Components
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch {
            // Safe to ignore inside Server Actions/Components
          }
        },
      },
    }
  );

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Error('Unauthorized: Access denied.');
  }

  const isAdmin = 
    user.app_metadata?.role === 'admin' ||
    user.user_metadata?.role === 'admin' ||
    user.app_metadata?.is_admin === true ||
    user.user_metadata?.is_admin === true;

  if (!isAdmin) {
    throw new Error('Unauthorized: Admin access required.');
  }

  return user;
};
