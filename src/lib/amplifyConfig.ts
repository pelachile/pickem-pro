// AWS Amplify configuration helper
import { Amplify } from 'aws-amplify';

// This function handles the configuration of AWS Amplify
// It will use amplify_outputs.json when available (in AWS deployment)
// or fall back to environment variables for local development
export async function configureAmplify(): Promise<void> {
  try {
    // Try to dynamically import the amplify outputs file
    const outputs = await import('../../amplify_outputs.json');
    Amplify.configure(outputs.default || outputs);
    console.log('AWS Amplify configured with amplify_outputs.json');
  } catch (error) {
    console.warn('amplify_outputs.json not found. Attempting fallback configuration.');
    
    // Fallback configuration using environment variables
    if (import.meta.env.VITE_AMPLIFY_USER_POOL_ID) {
      const fallbackConfig = {
        auth: {
          user_pool_id: import.meta.env.VITE_AMPLIFY_USER_POOL_ID,
          user_pool_client_id: import.meta.env.VITE_AMPLIFY_USER_POOL_CLIENT_ID,
          aws_region: import.meta.env.VITE_AMPLIFY_REGION || 'us-east-2',
        }
      };
      Amplify.configure(fallbackConfig);
      console.log('AWS Amplify configured with environment variables');
    } else {
      console.warn('No AWS Amplify configuration found. Authentication may not work properly.');
    }
  }
}

export default configureAmplify;