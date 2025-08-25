#!/usr/bin/env node

/**
 * Simple test script to verify league creation functionality
 * Run with: node test-league-creation.js
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAuthentication() {
  console.log('🔐 Testing authentication...');
  
  // Try to get the current user (should work with existing session)
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  console.log('User check:', { user: user?.id, error: userError?.message });
  
  if (!user) {
    console.log('⚠️ No authenticated user. Attempting to sign in...');
    
    // Try to sign in with the existing user
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'cory@corymoore.com',
      password: 'testpassword' // You'll need to provide the correct password
    });
    
    console.log('Sign in attempt:', { 
      user: signInData?.user?.id, 
      error: signInError?.message 
    });
    
    if (signInError) {
      console.error('❌ Cannot authenticate. Please sign in manually first.');
      return false;
    }
  }
  
  const { data: session } = await supabase.auth.getSession();
  console.log('Session check:', { 
    hasSession: !!session?.session,
    accessToken: session?.session?.access_token ? 'present' : 'missing'
  });
  
  return !!session?.session;
}

async function testLeagueCreation() {
  console.log('\n🏈 Testing league creation...');
  
  const leagueData = {
    name: 'Test League ' + Date.now(),
    description: 'A test league created by the debug script',
    created_by: (await supabase.auth.getUser()).data.user?.id,
    entry_fee: 10,
    max_members: 12,
    is_private: false,
    password_hash: null,
    invite_code: generateInviteCode(),
    status: 'active',
  };
  
  console.log('Attempting to insert:', leagueData);
  
  const { data: league, error } = await supabase
    .from('leagues')
    .insert(leagueData)
    .select()
    .single();
    
  if (error) {
    console.error('❌ League creation failed:', error);
    return false;
  }
  
  console.log('✅ League created successfully:', league);
  
  // Add the creator as admin
  const memberData = {
    league_id: league.id,
    user_id: leagueData.created_by,
    role: 'admin',
  };
  
  const { error: memberError } = await supabase
    .from('league_members')
    .insert(memberData);
    
  if (memberError) {
    console.error('❌ Failed to add league member:', memberError);
    
    // Cleanup the league
    await supabase.from('leagues').delete().eq('id', league.id);
    return false;
  }
  
  console.log('✅ League member added successfully');
  console.log('🎯 Test league created with ID:', league.id);
  console.log('📋 Invite code:', league.invite_code);
  
  return true;
}

function generateInviteCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function main() {
  try {
    console.log('🚀 Starting league creation test...\n');
    
    const authSuccess = await testAuthentication();
    if (!authSuccess) {
      console.error('❌ Authentication failed. Cannot proceed.');
      process.exit(1);
    }
    
    const leagueSuccess = await testLeagueCreation();
    if (!leagueSuccess) {
      console.error('❌ League creation test failed.');
      process.exit(1);
    }
    
    console.log('\n✅ All tests passed! League creation is working.');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

main();