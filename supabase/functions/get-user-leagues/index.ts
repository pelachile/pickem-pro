import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';
import type { GetUserLeaguesResponse } from '../_shared/types.ts';

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

    // Only allow GET requests
    if (req.method !== 'GET') {
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

    // Query leagues where user is a member using a join approach
    const { data: userLeagues, error: queryError } = await supabase
      .from('league_members')
      .select(`
        role,
        joined_at,
        leagues (
          id,
          name,
          description,
          entry_fee,
          max_members,
          is_private,
          invite_code,
          status,
          created_at,
          created_by
        )
      `)
      .eq('user_id', user.id)
      .order('joined_at', { ascending: false });

    if (queryError) {
      console.error('Error querying user leagues:', queryError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to fetch user leagues - please try again',
          code: 'QUERY_LEAGUES_FAILED'
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get member counts for each league efficiently
    const leagueIds = userLeagues?.map(ul => ul.leagues?.id).filter(Boolean) || [];
    let memberCountMap = new Map<string, number>();

    if (leagueIds.length > 0) {
      const { data: memberCounts, error: countError } = await supabase
        .from('league_members')
        .select('league_id')
        .in('league_id', leagueIds);

      if (countError) {
        console.error('Error counting league members:', countError);
        // Continue with empty counts if this fails
      } else {
        // Count members per league
        memberCounts?.forEach(mc => {
          memberCountMap.set(mc.league_id, (memberCountMap.get(mc.league_id) || 0) + 1);
        });
      }
    }

    // Transform the data
    const leaguesWithMemberCount = (userLeagues || []).map(userLeague => {
      const league = userLeague.leagues;
      if (!league) return null;

      // Determine if user is admin (either created the league or has admin role)
      const isUserAdmin = league.created_by === user.id || userLeague.role === 'admin';

      return {
        id: league.id,
        name: league.name,
        description: league.description,
        entryFee: parseFloat(league.entry_fee || '0'),
        maxMembers: league.max_members,
        currentMembers: memberCountMap.get(league.id) || 0,
        isPrivate: league.is_private,
        // Only include invite code if user is admin
        ...(isUserAdmin && { inviteCode: league.invite_code }),
        status: league.status,
        createdAt: league.created_at,
        userRole: userLeague.role,
        joinedAt: userLeague.joined_at
      };
    }).filter(Boolean) as Array<{
      id: string;
      name: string;
      description?: string;
      entryFee: number;
      maxMembers: number;
      currentMembers: number;
      isPrivate: boolean;
      inviteCode?: string;
      status: string;
      createdAt: string;
      userRole: 'admin' | 'member';
      joinedAt: string;
    }>;

    // Prepare the successful response
    const response: GetUserLeaguesResponse = {
      success: true,
      data: leaguesWithMemberCount
    };

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Unexpected error in get-user-leagues:', error);
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