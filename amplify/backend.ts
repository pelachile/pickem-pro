import { defineBackend } from '@aws-amplify/backend';
import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { espnSync } from './functions/espn-sync/resource';
import { aiAnalysis } from './functions/ai-analysis/resource';
import { bedrockHello } from './functions/bedrock-hello/resource';

/**
 * Backend configuration for Pick'em Pro
 * - auth: AWS Cognito authentication
 * - data: GraphQL API with DynamoDB (hybrid static/dynamic data)
 * - espnSync: Scheduled Lambda for ESPN API integration
 * - aiAnalysis: AI-powered analysis with AWS Bedrock integration
 * - bedrockHello: Hello World test with Bedrock Claude integration
 */
const backend = defineBackend({
  auth,
  data,
  espnSync,
  aiAnalysis,
  bedrockHello,
});


// Grant Bedrock permissions to the Hello World Lambda function
backend.bedrockHello.resources.lambda.addToRolePolicy(
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
      'arn:aws:bedrock:us-east-2:020760382742:inference-profile/us.anthropic.claude-3-5-sonnet-20240620-v1:0',
      'arn:aws:bedrock:us-east-2::foundation-model/*',
    ],
  })
);

// Grant Bedrock permissions to the AI Analysis Lambda function
// FIXED: Bedrock foundation models are global resources and need proper ARN format
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
      // CRITICAL FIX: Bedrock foundation models are regional resources
      // us-east-2 models
      'arn:aws:bedrock:us-east-2::foundation-model/anthropic.claude-3-5-sonnet-20241022-v2:0',
      'arn:aws:bedrock:us-east-2::foundation-model/anthropic.claude-3-5-sonnet-20240620-v1:0',
      'arn:aws:bedrock:us-east-2::foundation-model/anthropic.claude-3-haiku-20240307-v1:0',
      `arn:aws:bedrock:us-east-2:020760382742:inference-profile/us.anthropic.claude-3-5-sonnet-20240620-v1:0`,
      'arn:aws:bedrock:us-east-2::foundation-model/*',
      // us-west-2 models (inference profile redirection)
      'arn:aws:bedrock:us-west-2::foundation-model/anthropic.claude-3-5-sonnet-20241022-v2:0',
      'arn:aws:bedrock:us-west-2::foundation-model/anthropic.claude-3-5-sonnet-20240620-v1:0',
      'arn:aws:bedrock:us-west-2::foundation-model/anthropic.claude-3-haiku-20240307-v1:0',
      'arn:aws:bedrock:us-west-2::foundation-model/*',
    ],
  })
);

// ADDITIONAL FIX: Ensure Lambda can assume its role properly
backend.aiAnalysis.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: [
      'sts:AssumeRole',
      'sts:GetCallerIdentity',
    ],
    resources: ['*'],
  })
);

// CRITICAL FIX: Grant Data API access to the AI Analysis Lambda function
// This allows the Lambda to read/write to DynamoDB tables via GraphQL API
backend.data.resources.graphqlApi.grantMutation(backend.aiAnalysis.resources.lambda, 'aiAnalysisLambdaMutation');
backend.data.resources.graphqlApi.grantQuery(backend.aiAnalysis.resources.lambda, 'aiAnalysisLambdaQuery');

// ENHANCED FIX: Grant explicit AppSync permissions
backend.aiAnalysis.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: [
      'appsync:GraphQL',
      'appsync:GetGraphqlApi',
      'appsync:ListGraphqlApis',
    ],
    resources: [
      backend.data.resources.graphqlApi.arn,
      `${backend.data.resources.graphqlApi.arn}/*`,
    ],
  })
);

// Grant direct DynamoDB permissions as backup (in case GraphQL permissions aren't sufficient)
backend.aiAnalysis.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: [
      'dynamodb:PutItem',
      'dynamodb:GetItem',
      'dynamodb:UpdateItem',
      'dynamodb:DeleteItem',
      'dynamodb:Query',
      'dynamodb:Scan',
      'dynamodb:BatchGetItem',
      'dynamodb:BatchWriteItem',
      'dynamodb:DescribeTable',
      'dynamodb:ListTables',
    ],
    resources: [
      // Grant access to all tables in this Amplify backend (safest approach)
      `arn:aws:dynamodb:*:*:table/amplify-*`,
      `arn:aws:dynamodb:*:*:table/amplify-*/index/*`,
      // Fallback for all tables (needed for Amplify Gen 2)
      `arn:aws:dynamodb:*:*:table/*`,
      `arn:aws:dynamodb:*:*:table/*/index/*`,
    ],
  })
);

// DEBUGGING FIX: Add CloudWatch logging permissions
backend.aiAnalysis.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: [
      'logs:CreateLogGroup',
      'logs:CreateLogStream',
      'logs:PutLogEvents',
      'logs:DescribeLogGroups',
      'logs:DescribeLogStreams',
    ],
    resources: ['*'],
  })
);


// Note: Lambda invoke permissions for authenticated users are configured manually in AWS Console
// The authenticatedUserIamRole has been granted lambda:InvokeFunction permissions
