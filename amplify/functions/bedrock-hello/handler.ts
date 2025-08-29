import type { APIGatewayProxyHandler } from 'aws-lambda';
import { 
  BedrockRuntimeClient, 
  InvokeModelCommand,
  InvokeModelCommandInput
} from '@aws-sdk/client-bedrock-runtime';

let bedrockClient: BedrockRuntimeClient | null = null;

/**
 * Initialize Bedrock client with proper Lambda IAM credentials
 */
function initializeBedrockClient(): BedrockRuntimeClient {
  if (bedrockClient) return bedrockClient;
  
  const region = process.env.BEDROCK_REGION || process.env.AWS_REGION || 'us-east-2';
  
  console.log('🤖 INITIALIZING BEDROCK CLIENT:', {
    region,
    modelId: process.env.BEDROCK_MODEL_ID,
    AWS_REGION: process.env.AWS_REGION,
    BEDROCK_REGION: process.env.BEDROCK_REGION,
    AWS_DEFAULT_REGION: process.env.AWS_DEFAULT_REGION
  });
  
  bedrockClient = new BedrockRuntimeClient({ 
    region,
    credentials: undefined, // Let SDK auto-discover Lambda IAM role
    maxAttempts: 3,
    retryMode: 'adaptive'
  });
  
  console.log('✅ BEDROCK CLIENT INITIALIZED');
  return bedrockClient;
}

/**
 * Invoke Bedrock Claude model with proper payload format
 */
async function invokeClaudeModel(prompt: string, name: string): Promise<{ message: string }> {
  const bedrock = initializeBedrockClient();
  const modelId = process.env.BEDROCK_MODEL_ID || 'anthropic.claude-3-5-sonnet-20241022-v2:0';
  
  console.log('🤖 INVOKING BEDROCK:', {
    modelId,
    promptLength: prompt.length,
    clientRegion: bedrock.config.region
  });
  
  try {
    const input: InvokeModelCommandInput = {
      modelId,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 512,
        temperature: 0.7,
        messages: [{
          role: "user",
          content: `${prompt}\n\nPlease greet ${name} in a friendly way.`
        }]
      })
    };

    const command = new InvokeModelCommand(input);
    const response = await bedrock.send(command);
    
    if (!response.body) {
      throw new Error('Empty response from Bedrock');
    }

    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    
    console.log('✅ BEDROCK SUCCESS:', {
      responseLength: responseBody.content?.[0]?.text?.length || 0
    });
    
    return {
      message: responseBody.content[0].text
    };

  } catch (error: any) {
    console.error('❌ BEDROCK ERROR:', {
      errorMessage: error.message,
      errorCode: error.$metadata?.httpStatusCode,
      errorType: error.name,
      region: process.env.AWS_REGION,
      modelId
    });
    
    throw new Error(`Bedrock invocation failed: ${error.message}`);
  }
}

/**
 * Lambda handler for Hello World Bedrock test
 */
export const handler: APIGatewayProxyHandler = async (event) => {
  console.log('🚀 BEDROCK HELLO LAMBDA START:', JSON.stringify(event, null, 2));
  
  try {
    // Parse the request body to get the name argument
    const body = event.body ? JSON.parse(event.body) : {};
    const name = body.name || 'World';
    
    console.log('📝 REQUEST:', { name });
    
    // Call Bedrock with the proper format
    const result = await invokeClaudeModel(
      'You are a helpful assistant that responds with greetings.',
      name
    );
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(result)
    };
    
  } catch (error: any) {
    console.error('🚨 LAMBDA ERROR:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: 'Bedrock Hello failed',
        message: error.message
      })
    };
  }
};