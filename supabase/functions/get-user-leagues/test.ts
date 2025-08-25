/**
 * Test file for the get-user-leagues function
 * 
 * This file can be used to manually test the function locally.
 * Run with: deno run --allow-net --allow-env test.ts
 */

const SUPABASE_URL = 'http://127.0.0.1:54321';
const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/get-user-leagues`;

/**
 * Test the get-user-leagues function
 */
async function testGetUserLeagues() {
  console.log('Testing get-user-leagues function...\n');

  // Test 1: Missing Authorization header
  console.log('Test 1: Missing Authorization header');
  try {
    const response = await fetch(FUNCTION_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const result = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(result, null, 2));
    console.log('Expected: 401 with MISSING_AUTH_HEADER error\n');
  } catch (error) {
    console.error('Error:', error);
  }

  // Test 2: Invalid method (POST instead of GET)
  console.log('Test 2: Invalid method (POST instead of GET)');
  try {
    const response = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer fake-token',
      },
    });
    
    const result = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(result, null, 2));
    console.log('Expected: 405 with METHOD_NOT_ALLOWED error\n');
  } catch (error) {
    console.error('Error:', error);
  }

  // Test 3: Invalid token
  console.log('Test 3: Invalid token');
  try {
    const response = await fetch(FUNCTION_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer invalid-token',
      },
    });
    
    const result = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(result, null, 2));
    console.log('Expected: 401 with INVALID_TOKEN error\n');
  } catch (error) {
    console.error('Error:', error);
  }

  // Test 4: CORS preflight
  console.log('Test 4: CORS preflight request');
  try {
    const response = await fetch(FUNCTION_URL, {
      method: 'OPTIONS',
    });
    
    console.log('Status:', response.status);
    console.log('CORS Headers:');
    console.log('  Access-Control-Allow-Origin:', response.headers.get('Access-Control-Allow-Origin'));
    console.log('  Access-Control-Allow-Methods:', response.headers.get('Access-Control-Allow-Methods'));
    console.log('  Access-Control-Allow-Headers:', response.headers.get('Access-Control-Allow-Headers'));
    console.log('Expected: 200 with appropriate CORS headers\n');
  } catch (error) {
    console.error('Error:', error);
  }

  console.log('Manual tests completed!');
  console.log('\nTo test with a valid token:');
  console.log('1. Start Supabase locally: supabase start');
  console.log('2. Create a user account in the local auth');
  console.log('3. Get a valid JWT token');
  console.log('4. Run: curl -X GET "http://127.0.0.1:54321/functions/v1/get-user-leagues" \\');
  console.log('     -H "Authorization: Bearer YOUR_JWT_TOKEN" \\');
  console.log('     -H "Content-Type: application/json"');
}

// Run the tests
if (import.meta.main) {
  await testGetUserLeagues();
}