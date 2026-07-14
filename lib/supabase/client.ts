/**
 * Supabase client factory.
 * Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local
 * when connecting to a live project.
 */

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export function getSupabaseConfig(): SupabaseConfig | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) return null;

  return { url, anonKey };
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseConfig() !== null;
}

/**
 * Returns a typed Supabase client once @supabase/supabase-js is installed.
 * Until then, the repository layer falls back to local mock data.
 */
export function createSupabaseClient() {
  const config = getSupabaseConfig();

  if (!config) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  // When @supabase/supabase-js is added:
  // import { createClient } from "@supabase/supabase-js";
  // import type { Database } from "./database.types";
  // return createClient<Database>(config.url, config.anonKey);
  throw new Error(
    "Install @supabase/supabase-js and uncomment createClient in lib/supabase/client.ts"
  );
}
