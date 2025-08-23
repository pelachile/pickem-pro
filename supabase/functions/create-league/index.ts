import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
};

interface CreateLeagueRequest {
  name: string;
  description?: string;
  entryFee: number;
  maxMembers: number;
  isPrivate: boolean;
  password?: string;
}

interface CreateLeagueResponse {
  success: boolean;
  data?: {
    id: string;
    name: string;
    description?: string;
    entryFee: number;
    maxMembers: number;
    isPrivate: boolean;
    inviteCode: string;
    status: string;
    createdAt: string;
  };
  error?: string;
}

Deno.serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Authorization header required'
        }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Get the authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Unauthorized - Invalid or expired token'
        }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Method ${req.method} not allowed`
        }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse and validate the request body
    let requestBody: CreateLeagueRequest;
    try {
      requestBody = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid JSON in request body'
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Basic validation
    if (!requestBody.name || requestBody.name.trim().length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'League name is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (requestBody.maxMembers < 2 || requestBody.maxMembers > 50) {
      return new Response(
        JSON.stringify({ success: false, error: 'Max members must be between 2 and 50' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (requestBody.entryFee < 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'Entry fee cannot be negative' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (requestBody.isPrivate && (!requestBody.password || requestBody.password.trim().length === 0)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Password is required for private leagues' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Hash password if provided (simple hash for now)
    let passwordHash = null;
    if (requestBody.isPrivate && requestBody.password) {
      const encoder = new TextEncoder();
      const data = encoder.encode(requestBody.password);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      passwordHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // Create the league
    const { data: league, error: createError } = await supabase
      .from('leagues')
      .insert({
        name: requestBody.name.trim(),
        description: requestBody.description?.trim() || null,
        created_by: user.id,
        entry_fee: requestBody.entryFee,
        max_members: requestBody.maxMembers,
        is_private: requestBody.isPrivate,
        password_hash: passwordHash,
        status: 'active'
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating league:', createError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to create league - please try again'
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Add the creator as an admin member
    const { error: memberError } = await supabase
      .from('league_members')
      .insert({
        league_id: league.id,
        user_id: user.id,
        role: 'admin'
      });

    if (memberError) {
      console.error('Error adding creator as member:', memberError);
      // Try to clean up the league if adding the member failed
      await supabase.from('leagues').delete().eq('id', league.id);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to create league membership - please try again'
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Prepare the successful response
    const response: CreateLeagueResponse = {
      success: true,
      data: {
        id: league.id,
        name: league.name,
        description: league.description,
        entryFee: parseFloat(league.entry_fee || '0'),
        maxMembers: league.max_members,
        isPrivate: league.is_private,
        inviteCode: league.invite_code,
        status: league.status,
        createdAt: league.created_at
      }
    };

    return new Response(
      JSON.stringify(response),
      { 
        status: 201, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Unexpected error in create-league:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error - please try again later'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});