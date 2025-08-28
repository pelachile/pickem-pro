import { defineBackend } from '@aws-amplify/backend';
import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { espnSync } from './functions/espn-sync/resource';
import { aiAnalysis } from './functions/ai-analysis/resource';

/**
 * Backend configuration for Pick'em Pro
 * - auth: AWS Cognito authentication
 * - data: GraphQL API with DynamoDB (hybrid static/dynamic data)
 * - espnSync: Scheduled Lambda for ESPN API integration
 * - aiAnalysis: AI-powered analysis with AWS Bedrock integration
 */
const backend = defineBackend({
  auth,
  data,
  espnSync,
  aiAnalysis,
});

// Grant Bedrock permissions to the AI Analysis Lambda function
backend.aiAnalysis.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: [
      'bedrock:InvokeModel',
      'bedrock:InvokeModelWithResponseStream',
      'bedrock:GetModel',
      'bedrock:ListFoundationModels',
    ],
    resources: [
      'arn:aws:bedrock:us-east-2::foundation-model/anthropic.claude-3-5-sonnet-20241022-v2:0',
      'arn:aws:bedrock:us-east-2::foundation-model/anthropic.claude-3-5-sonnet-20240620-v1:0',
      'arn:aws:bedrock:us-east-2::foundation-model/anthropic.claude-3-sonnet-20240229-v1:0',
      'arn:aws:bedrock:us-east-2::foundation-model/anthropic.claude-3-haiku-20240307-v1:0',
    ],
  })
);
