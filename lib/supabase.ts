import { createBrowserClient } from '@supabase/ssr';

let client: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  if (client) return client;
  client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  return client;
}
// import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// // Singleton — hanya 1 instance global
// const globalForSupabase = globalThis as unknown as {
//   supabase: ReturnType<typeof createSupabaseClient> | undefined;
// };

// export function createClient() {
//   if (!globalForSupabase.supabase) {
//     globalForSupabase.supabase = createSupabaseClient(supabaseUrl, supabaseKey, {
//       auth: {
//         persistSession: true,
//         storageKey: 'sb-matacerdas',
//         storage: typeof window !== 'undefined' ? window.localStorage : undefined,
//         detectSessionInUrl: true,
//         flowType: 'pkce',
//       },
//     });
//   }
//   return globalForSupabase.supabase;
// }