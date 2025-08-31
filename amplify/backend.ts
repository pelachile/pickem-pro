import { defineBackend } from '@aws-amplify/backend';
import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { espnSync } from './functions/espn-sync/resource';
import { aiAnalysis } from './functions/ai-analysis/resource';
import { bedrockHello } from './functions/bedrock-hello/resource';
import { bedrockTeamAnalysis } from './functions/bedrock-team-analysis/resource';

/**
 * Backend configuration for Pick'em Pro
 * - auth: AWS Cognito authentication
 * - data: GraphQL API with DynamoDB (hybrid static/dynamic data)
 * - espnSync: Scheduled Lambda for ESPN API integration
 * - aiAnalysis: AI-powered analysis with AWS Bedrock integration
 * - bedrockHello: Hello World test with Bedrock Claude integration
 * - bedrockTeamAnalysis: Weekly AI team analysis with ESPN integration
 */
const backend = defineBackend({
  auth,
  data,
  espnSync,
  aiAnalysis,
  bedrockHello,
  bedrockTeamAnalysis,
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


// Grant comprehensive permissions to the bedrock-team-analysis Lambda function
backend.bedrockTeamAnalysis.resources.lambda.addToRolePolicy(
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
      'arn:aws:bedrock:us-east-2::foundation-model/anthropic.claude-3-haiku-20240307-v1:0',
      'arn:aws:bedrock:us-east-2::foundation-model/anthropic.claude-3-5-haiku-20241022-v1:0',
      'arn:aws:bedrock:us-east-2:020760382742:inference-profile/us.anthropic.claude-3-5-sonnet-20240620-v1:0',
      'arn:aws:bedrock:us-east-2:020760382742:inference-profile/us.anthropic.claude-3-5-haiku-20241022-v1:0',
      'arn:aws:bedrock:us-east-2::foundation-model/*',
      'arn:aws:bedrock:us-west-2::foundation-model/*',
      'arn:aws:bedrock:us-west-2:020760382742:inference-profile/us.anthropic.claude-3-5-sonnet-20240620-v1:0',
      'arn:aws:bedrock:us-west-2:020760382742:inference-profile/us.anthropic.claude-3-5-sonnet-20241022-v2:0',
      'arn:aws:bedrock:us-west-2:020760382742:inference-profile/us.anthropic.claude-3-5-haiku-20241022-v1:0',
      // us-east-1 inference profiles
      'arn:aws:bedrock:us-east-1::foundation-model/*',
      'arn:aws:bedrock:us-east-1:020760382742:inference-profile/us.anthropic.claude-3-5-sonnet-20240620-v1:0',
      'arn:aws:bedrock:us-east-1:020760382742:inference-profile/us.anthropic.claude-3-5-sonnet-20241022-v2:0',
      'arn:aws:bedrock:us-east-1:020760382742:inference-profile/us.anthropic.claude-3-5-haiku-20241022-v1:0',
    ],
  })
);

// Grant S3 permissions for analysis caching
backend.bedrockTeamAnalysis.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: [
      's3:GetObject',
      's3:PutObject',
      's3:DeleteObject',
      's3:ListBucket',
      's3:GetBucketLocation',
      's3:CreateBucket',
    ],
    resources: [
      'arn:aws:s3:::amplify-pickemapp-cory-sa-amplifydataamplifycodege-xlbjhi6tuxfw',
      'arn:aws:s3:::amplify-pickemapp-cory-sa-amplifydataamplifycodege-xlbjhi6tuxfw/*',
    ],
  })
);

// Grant CloudWatch permissions for logging
backend.bedrockTeamAnalysis.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: [
      'logs:CreateLogGroup',
      'logs:CreateLogStream',
      'logs:PutLogEvents',
    ],
    resources: ['*'],
  })
);

// Grant Lambda invoke permissions to authenticated users
backend.auth.resources.authenticatedUserIamRole.addToPrincipalPolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ['lambda:InvokeFunction'],
    resources: [
      backend.bedrockHello.resources.lambda.functionArn,
      backend.bedrockTeamAnalysis.resources.lambda.functionArn,
    ],
  })
);

// Note: Lambda invoke permissions for authenticated users are now configured via CDK
