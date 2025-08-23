import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';
import { verifyPassword } from '../_shared/crypto.ts';
import { validateJoinLeagueRequest } from '../_shared/validation.ts';
import type { 
  JoinLeagueRequest, 
  JoinLeagueResponse,
  ValidationErrorResponse,
  League,
  LeagueMember
} from '../_shared/types.ts';

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
          error: 'Authorization header required',
          code: 'MISSING_AUTH_HEADER'
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
          error: 'Unauthorized - Invalid or expired token',
          code: 'INVALID_TOKEN'
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
          error: `Method ${req.method} not allowed`,
          code: 'METHOD_NOT_ALLOWED'
        }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse and validate the request body
    let requestBody: JoinLeagueRequest;
    try {
      requestBody = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid JSON in request body',
          code: 'INVALID_JSON'
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate the request data
    const validationErrors = validateJoinLeagueRequest(requestBody);
    if (validationErrors.length > 0) {
      const response: ValidationErrorResponse = {
        success: false,
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        validationErrors: validationErrors
      };
      return new Response(
        JSON.stringify(response),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Find the league by invite code
    const inviteCode = requestBody.inviteCode.trim().toUpperCase();
    const { data: league, error: leagueError } = await supabase
      .from('leagues')
      .select('*')
      .eq('invite_code', inviteCode)
      .eq('status', 'active')
      .single();

    if (leagueError || !league) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid or expired invite code',
          code: 'INVALID_INVITE_CODE'
        }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check if user is already a member of this league
    const { data: existingMember } = await supabase
      .from('league_members')
      .select('id, role')
      .eq('league_id', league.id)
      .eq('user_id', user.id)
      .single();

    if (existingMember) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'You are already a member of this league',
          code: 'ALREADY_MEMBER'
        }),
        { 
          status: 409, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check current member count
    const { count: currentMembers, error: countError } = await supabase
      .from('league_members')
      .select('*', { count: 'exact', head: true })
      .eq('league_id', league.id);

    if (countError) {
      console.error('Error counting league members:', countError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to check league capacity',
          code: 'COUNT_MEMBERS_FAILED'
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check if league is full
    if (currentMembers !== null && currentMembers >= league.max_members) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'This league is full',
          code: 'LEAGUE_FULL'
        }),
        { 
          status: 409, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // For private leagues, verify password
    if (league.is_private && league.password_hash) {
      if (!requestBody.password) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Password required for private league',
            code: 'PASSWORD_REQUIRED'
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      const passwordValid = await verifyPassword(requestBody.password, league.password_hash);
      if (!passwordValid) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Incorrect password',
            code: 'INVALID_PASSWORD'
          }),
          { 
            status: 401, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    }

    // Add user as a member to the league
    const { data: newMember, error: memberError } = await supabase
      .from('league_members')
      .insert({
        league_id: league.id,
        user_id: user.id,
        role: 'member'
      })
      .select()
      .single();

    if (memberError) {
      console.error('Error adding league member:', memberError);
      
      // Check if it's a duplicate key error (race condition)
      if (memberError.code === '23505') {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'You are already a member of this league',
            code: 'ALREADY_MEMBER'
          }),
          { 
            status: 409, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to join league - please try again',
          code: 'JOIN_LEAGUE_FAILED'
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get updated member count (including the new member)
    const finalMemberCount = (currentMembers ?? 0) + 1;

    // Prepare the successful response
    const response: JoinLeagueResponse = {
      success: true,
      data: {
        leagueId: league.id,
        leagueName: league.name,
        role: 'member',
        joinedAt: newMember.joined_at,
        currentMembers: finalMemberCount,
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
        error: 'Internal server error - please try again later',
        code: 'INTERNAL_ERROR'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});