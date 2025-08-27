// TEMPORARY STUB FILE - Phase 1 AWS Amplify Migration
// This file provides stubs to prevent build errors while migrating to AWS Amplify
// TODO: Replace with AWS Amplify implementations in Phase 2

// Temporary type stubs
export interface User {
  id: string;
  email?: string;
  user_metadata?: Record<string, any>;
  app_metadata?: Record<string, any>;
}

export interface Database {
  public: {
    Tables: Record<string, any>;
  };
}

// Temporary client stub that throws informative errors
export const supabase = {
  auth: {
    getUser: () => Promise.resolve({ data: { user: null }, error: new Error('Supabase removed - use AWS Amplify') }),
    signIn: () => Promise.resolve({ error: new Error('Supabase removed - use AWS Amplify') }),
    signOut: () => Promise.resolve({ error: new Error('Supabase removed - use AWS Amplify') }),
    signUp: () => Promise.resolve({ error: new Error('Supabase removed - use AWS Amplify') }),
  },
  from: () => ({
    select: () => ({
      eq: () => Promise.resolve({ data: null, error: new Error('Supabase removed - use AWS Amplify') }),
      neq: () => Promise.resolve({ data: null, error: new Error('Supabase removed - use AWS Amplify') }),
      in: () => Promise.resolve({ data: null, error: new Error('Supabase removed - use AWS Amplify') }),
      single: () => Promise.resolve({ data: null, error: new Error('Supabase removed - use AWS Amplify') }),
    }),
    insert: () => Promise.resolve({ data: null, error: new Error('Supabase removed - use AWS Amplify') }),
    update: () => Promise.resolve({ data: null, error: new Error('Supabase removed - use AWS Amplify') }),
    delete: () => Promise.resolve({ data: null, error: new Error('Supabase removed - use AWS Amplify') }),
  }),
  functions: {
    invoke: () => Promise.resolve({ data: null, error: new Error('Supabase removed - use AWS Amplify') }),
  },
  channel: () => ({
    on: () => ({
      subscribe: () => ({ unsubscribe: () => {} }),
    }),
  }),
};

// Stub helper functions
export async function getCurrentUser(): Promise<User | null> {
  console.warn('getCurrentUser: Supabase removed - implement with AWS Amplify');
  return null;
}

export async function getCurrentUserId(): Promise<string | null> {
  console.warn('getCurrentUserId: Supabase removed - implement with AWS Amplify');
  return null;
}

export async function isAuthenticated(): Promise<boolean> {
  console.warn('isAuthenticated: Supabase removed - implement with AWS Amplify');
  return false;
}

// Stub DatabaseQueryBuilder
export class DatabaseQueryBuilder {
  static async execute<T>(
    queryPromise: Promise<{ data: T; error: any }>
  ): Promise<{ data: T | null; error: string | null }> {
    console.warn('DatabaseQueryBuilder: Supabase removed - implement with AWS Amplify');
    return {
      data: null,
      error: 'Supabase removed - implement with AWS Amplify',
    };
  }
}

// Stub realtime subscription
export function createRealtimeSubscription<T extends keyof Database['public']['Tables']>(
  table: T,
  callback: (payload: any) => void,
  filter?: string
) {
  console.warn('createRealtimeSubscription: Supabase removed - implement with AWS Amplify');
  return {
    subscription: { unsubscribe: () => {} },
    unsubscribe: () => {},
  };
}

// Stub error parsing
export function parseSupabaseError(error: unknown): string {
  console.warn('parseSupabaseError: Supabase removed - implement with AWS Amplify');
  return 'Supabase removed - implement with AWS Amplify';
}

// Stub feature flags
export function isFeatureEnabled(flag: string): boolean {
  console.warn('isFeatureEnabled: Supabase removed - implement with AWS Amplify');
  return false;
}

// Stub edge function calls
export async function callEdgeFunction<T = any>(
  functionName: string,
  payload?: any
): Promise<{ data: T | null; error: string | null }> {
  console.warn('callEdgeFunction: Supabase removed - implement with AWS Amplify');
  return {
    data: null,
    error: 'Supabase removed - implement with AWS Amplify',
  };
}

// Stub migration tracker
export const migrationTracker = {
  logDirectQuery: (table: string, operation: string) => {
    console.warn('migrationTracker.logDirectQuery: Supabase removed');
  },
  logEdgeFunction: (functionName: string) => {
    console.warn('migrationTracker.logEdgeFunction: Supabase removed');
  },
  logRealtime: (table: string, event: string) => {
    console.warn('migrationTracker.logRealtime: Supabase removed');
  },
};

export default supabase;

// Type exports (stubs)
export type { Database };
export type TypedSupabaseClient = typeof supabase;