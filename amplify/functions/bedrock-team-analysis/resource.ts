import { defineFunction } from '@aws-amplify/backend';

export const bedrockTeamAnalysis = defineFunction({
  entry: './handler.ts',
  environment: {
    BEDROCK_MODEL_ID: 'us.anthropic.claude-3-5-haiku-20241022-v1:0',
    S3_BUCKET_NAME: 'amplify-pickemapp-cory-sa-amplifydataamplifycodege-xlbjhi6tuxfw'
  },
  timeoutSeconds: 900, // 15 minutes for processing all 32 teams
  memoryMB: 1024,
  resourceGroupName: 'bedrockTeamAnalysis',
  // schedule: 'cron(0 17 ? * 3 *)' // TODO: Add EventBridge schedule manually in AWS Console
  // Schedule will be configured manually: Tuesday at 1 PM EST
});