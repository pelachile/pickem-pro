import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';
import { hashPassword } from '../_shared/crypto.ts';
import { validateCreateLeagueRequest } from '../_shared/validation.ts';
import type { 
  CreateLeagueRequest, 
  CreateLeagueResponse,
  ValidationErrorResponse 
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
    let requestBody: CreateLeagueRequest;
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
    const validationErrors = validateCreateLeagueRequest(requestBody);
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

    // Hash password if provided
    let passwordHash = null;
    if (requestBody.isPrivate && requestBody.password) {
      passwordHash = await hashPassword(requestBody.password);
    }

    // Check if league name already exists for this user
    const { data: existingLeague } = await supabase
      .from('leagues')
      .select('id')
      .eq('created_by', user.id)
      .eq('name', requestBody.name.trim())
      .single();

    if (existingLeague) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'A league with this name already exists in your account',
          code: 'DUPLICATE_LEAGUE_NAME'
        }),
        { 
          status: 409, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
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
          error: 'Failed to create league - please try again',
          code: 'CREATE_LEAGUE_FAILED'
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
          error: 'Failed to create league membership - please try again',
          code: 'CREATE_MEMBERSHIP_FAILED'
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