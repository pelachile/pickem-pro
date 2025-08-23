/**
 * CORS headers for Supabase Edge Functions
 * 
 * These headers allow cross-origin requests from the frontend application
 * and ensure proper CORS handling for all function endpoints.
 */

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Max-Age': '86400', // 24 hours
};