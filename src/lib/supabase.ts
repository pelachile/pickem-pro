import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { User } from '@supabase/supabase-js';
import type { Database } from '../types/supabase-generated';

// Validate environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('Missing VITE_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable');
}

// Create typed Supabase client
export const supabase: SupabaseClient<Database> = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    },
    global: {
      headers: {
        'X-Client-Info': 'picks-app-frontend/1.0.0',
      },
    },
    db: {
      schema: 'public',
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

// =====================================
// Type-safe helper functions
// =====================================

/**
 * Get the current authenticated user
 * @returns Promise<User | null>
 */
export async function getCurrentUser(): Promise<User | null> {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Error getting current user:', error);
    return null;
  }
  return user;
}

/**
 * Get the current user's ID
 * @returns Promise<string | null>
 */
export async function getCurrentUserId(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? null;
}

/**
 * Check if user is authenticated
 * @returns Promise<boolean>
 */
export async function isAuthenticated(): Promise<boolean> {
  const userId = await getCurrentUserId();
  return userId !== null;
}

// =====================================
// Database query helpers
// =====================================

/**
 * Type-safe wrapper for database queries with automatic error handling
 */
export class DatabaseQueryBuilder {
  static async execute<T>(
    queryPromise: Promise<{ data: T; error: any }>
  ): Promise<{ data: T | null; error: string | null }> {
    try {
      const { data, error } = await queryPromise;
      
      if (error) {
        console.error('Database query error:', error);
        return {
          data: null,
          error: error.message || 'Database query failed',
        };
      }
      
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Unexpected database error:', err);
      return {
        data: null,
        error: errorMessage,
      };
    }
  }
}

// =====================================
// Real-time subscription helpers
// =====================================

/**
 * Create a real-time subscription with proper typing
 * @param table - Table name to subscribe to
 * @param callback - Callback function for changes
 * @param filter - Optional filter for the subscription
 */
export function createRealtimeSubscription<T extends keyof Database['public']['Tables']>(
  table: T,
  callback: (payload: any) => void,
  filter?: string
) {
  let subscription = supabase
    .channel(`${table}_changes`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: table as string,
        filter,
      },
      callback
    )
    .subscribe();

  return {
    subscription,
    unsubscribe: () => subscription.unsubscribe(),
  };
}

// =====================================
// Error handling utilities
// =====================================

/**
 * Parse Supabase error into user-friendly message
 * @param error - Supabase error object
 * @returns User-friendly error message
 */
export function parseSupabaseError(error: any): string {
  if (!error) return 'Unknown error occurred';
  
  // Handle specific error codes
  switch (error.code) {
    case 'PGRST116':
      return 'No data found or access denied';
    case 'PGRST301':
      return 'Invalid request parameters';
    case '42501':
      return 'Permission denied - check your access rights';
    case '23505':
      return 'This data already exists';
    case '23503':
      return 'Referenced data does not exist';
    case '23514':
      return 'Invalid data format';
    default:
      return error.message || 'Database operation failed';
  }
}

// =====================================
// Feature flag helpers for migration
// =====================================

/**
 * Check if a specific feature flag is enabled
 * This will be used during the gradual migration
 */
export function isFeatureEnabled(flag: string): boolean {
  // During development, you can override feature flags
  if (import.meta.env.DEV) {
    const override = import.meta.env[`VITE_FEATURE_${flag.toUpperCase()}`];
    if (override !== undefined) {
      return override === 'true';
    }
  }
  
  // Default feature flags during migration
  const defaultFlags: Record<string, boolean> = {
    use_direct_league_queries: true,  // Phase 3: Enable direct league queries
    use_direct_member_queries: false, // Phase 3: Enable direct member queries
    use_direct_pick_queries: true,    // Phase 3: Enable direct pick queries ✅
    use_realtime_subscriptions: false, // Phase 3: Enable real-time features
    enable_optimistic_updates: false,  // Phase 4: Enable optimistic updates
  };
  
  return defaultFlags[flag] ?? false;
}

// =====================================
// Legacy edge function helpers
// (These will be deprecated after migration)
// =====================================

/**
 * Call a Supabase Edge Function with proper error handling
 * @param functionName - Name of the edge function
 * @param payload - Data to send to the function
 * @returns Promise with typed response
 */
export async function callEdgeFunction<T = any>(
  functionName: string,
  payload?: any
): Promise<{ data: T | null; error: string | null }> {
  try {
    const { data, error } = await supabase.functions.invoke(functionName, {
      body: payload,
    });
    
    if (error) {
      console.error(`Edge function ${functionName} error:`, error);
      return {
        data: null,
        error: error.message || `Failed to call ${functionName}`,
      };
    }
    
    // Handle function response format
    if (data && typeof data === 'object' && 'success' in data) {
      if (data.success) {
        return { data: data.data || data, error: null };
      } else {
        return {
          data: null,
          error: data.error || `${functionName} operation failed`,
        };
      }
    }
    
    return { data, error: null };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    console.error(`Unexpected error calling ${functionName}:`, err);
    return {
      data: null,
      error: errorMessage,
    };
  }
}

// =====================================
// Migration status tracking
// =====================================

/**
 * Track migration status and feature flag usage
 */
export const migrationTracker = {
  /**
   * Log when a direct query is used instead of edge function
   */
  logDirectQuery: (table: string, operation: string) => {
    if (import.meta.env.DEV) {
      console.log(`🔄 Migration: Using direct ${operation} query on ${table}`);
    }
  },
  
  /**
   * Log when an edge function is still being used
   */
  logEdgeFunction: (functionName: string) => {
    if (import.meta.env.DEV) {
      console.log(`⚡ Legacy: Using edge function ${functionName}`);
    }
  },
  
  /**
   * Log real-time subscription usage
   */
  logRealtime: (table: string, event: string) => {
    if (import.meta.env.DEV) {
      console.log(`📡 Realtime: ${event} on ${table}`);
    }
  },
};

// Export the typed client as default
export default supabase;

// =====================================
// Type exports for convenience
// =====================================
export type { Database } from '../types/supabase-generated';
export type TypedSupabaseClient = SupabaseClient<Database>;

/**
 * =================
 * Migration Notes:
 * =================
 * 
 * Phase 1 (Current): 
 * - Added full TypeScript support
 * - Created helper functions for database operations
 * - Set up feature flag system for gradual migration
 * - Added real-time subscription helpers
 * 
 * Phase 2 (Next):
 * - Enable direct database queries with feature flags
 * - Implement RLS policies
 * - Add comprehensive error handling
 * 
 * Phase 3 (Implementation):
 * - Replace edge function calls with direct queries
 * - Enable real-time subscriptions
 * - Add optimistic updates
 * 
 * Usage Examples:
 * 
 * // Direct typed query (Phase 3+)
 * const { data: leagues, error } = await supabase
 *   .from('leagues')
 *   .select('*')
 *   .eq('is_private', false);
 * 
 * // Edge function call (Current - will be deprecated)
 * const { data, error } = await callEdgeFunction('get-user-leagues');
 * 
 * // Real-time subscription (Phase 3+)
 * const { unsubscribe } = createRealtimeSubscription(
 *   'leagues',
 *   (payload) => console.log('League updated:', payload)
 * );
 */