import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders } from '../_shared/cors.ts';

/**
 * Simple test function for Supabase Edge Functions
 * 
 * This function can be used to verify that the Edge Functions
 * deployment is working correctly and CORS is configured properly.
 * 
 * @route GET|POST /functions/v1/test-simple
 * @auth Not required
 */
Deno.serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  console.log('Test function called');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Headers:', Object.fromEntries(req.headers.entries()));
  
  // Get environment info for debugging
  const envInfo = {
    SUPABASE_URL: Deno.env.get('SUPABASE_URL') ? 'Set' : 'Not set',
    SUPABASE_ANON_KEY: Deno.env.get('SUPABASE_ANON_KEY') ? 'Set' : 'Not set',
    SUPABASE_SERVICE_ROLE_KEY: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ? 'Set' : 'Not set',
  };
  
  const response = {
    success: true,
    message: 'Edge Functions are working correctly!',
    timestamp: new Date().toISOString(),
    method: req.method,
    userAgent: req.headers.get('User-Agent'),
    environment: envInfo,
    deno: {
      version: Deno.version.deno,
      typescript: Deno.version.typescript,
    }
  };
  
  return new Response(
    JSON.stringify(response, null, 2),
    {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  );
});