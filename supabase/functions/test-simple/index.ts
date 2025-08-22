Deno.serve(async (req) => {
  console.log('Test function called')
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      }
    })
  }
  
  return new Response(
    JSON.stringify({
      success: true,
      message: 'Test function works!',
      timestamp: new Date().toISOString()
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      status: 200,
    }
  )
})