import { defineFunction } from '@aws-amplify/backend';

export const bedrockHello = defineFunction({
  entry: './handler.ts',
  environment: {
    BEDROCK_REGION: 'us-east-2',
    BEDROCK_MODEL_ID: 'us.anthropic.claude-3-5-sonnet-20240620-v1:0'
  },
  timeoutSeconds: 30,
  // Force deployment update - v2
  resourceGroupName: 'bedrockHello'
});