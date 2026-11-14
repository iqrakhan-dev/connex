import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

export const getSupabaseClient = (url?: string, key?: string): SupabaseClient | null => {
  const supabaseUrl = url || import.meta.env.VITE_SUPABASE_URL || localStorage.getItem('connex_supabase_url');
  const supabaseAnonKey = key || import.meta.env.VITE_SUPABASE_ANON_KEY || localStorage.getItem('connex_supabase_key');

  if (supabaseUrl && supabaseAnonKey) {
    try {
      if (!supabaseClient) {
        supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
      }
      return supabaseClient;
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      return null;
    }
  }
  return null;
};

export const resetSupabaseClient = () => {
  supabaseClient = null;
};

export const testSupabaseConnection = async (url: string, key: string): Promise<{ success: boolean; message: string }> => {
  try {
    const testClient = createClient(url, key);
    // Simple ping check
    const { error } = await testClient.from('connex_notebooks').select('count', { count: 'exact', head: true });
    if (error && error.code !== 'PGRST116' && error.code !== '42P01') {
      // 42P01 means table does not exist yet which still proves connection is valid
      return { success: false, message: error.message };
    }
    return { success: true, message: 'Connected successfully to Supabase instance!' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Network error connecting to Supabase' };
  }
};
