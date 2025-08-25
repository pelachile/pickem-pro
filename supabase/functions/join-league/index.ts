import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
};

interface JoinLeagueRequest {
  inviteCode: string;
  password?: string;
}

interface JoinLeagueResponse {
  success: boolean;
  data?: {
    leagueId: string;
    leagueName: string;
    role: 'member';
    joinedAt: string;
    currentMembers: number;
    maxMembers: number;
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

    // Parse the request body
    let requestBody: JoinLeagueRequest;
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

    // Validate invite code
    if (!requestBody.inviteCode || requestBody.inviteCode.trim().length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invite code is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Find league by invite code
    const { data: league, error: leagueError } = await supabase
      .from('leagues')
      .select('*')
      .eq('invite_code', requestBody.inviteCode.trim().toUpperCase())
      .eq('status', 'active')
      .single();

    if (leagueError || !league) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid invite code or league not found'
        }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check if user is already a member
    const { data: existingMember } = await supabase
      .from('league_members')
      .select('id')
      .eq('league_id', league.id)
      .eq('user_id', user.id)
      .single();

    if (existingMember) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'You are already a member of this league'
        }),
        { 
          status: 409, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check if league is full
    const { count: currentMembers } = await supabase
      .from('league_members')
      .select('id', { count: 'exact' })
      .eq('league_id', league.id);

    if (currentMembers && currentMembers >= league.max_members) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'League is full'
        }),
        { 
          status: 409, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // For private leagues, verify password
    if (league.is_private) {
      if (!requestBody.password) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Password is required for private leagues'
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Hash the provided password and compare
      const encoder = new TextEncoder();
      const data = encoder.encode(requestBody.password);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const providedHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      if (providedHash !== league.password_hash) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Incorrect password'
          }),
          { 
            status: 401, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    }

    // Add user to league
    const { data: membership, error: memberError } = await supabase
      .from('league_members')
      .insert({
        league_id: league.id,
        user_id: user.id,
        role: 'member'
      })
      .select()
      .single();

    if (memberError) {
      console.error('Error adding member:', memberError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to join league - please try again'
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Prepare the successful response
    const response: JoinLeagueResponse = {
      success: true,
      data: {
        leagueId: league.id,
        leagueName: league.name,
        role: 'member',
        joinedAt: membership.joined_at,
        currentMembers: (currentMembers || 0) + 1,
        maxMembers: league.max_members
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
    console.error('Unexpected error in join-league:', error);
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