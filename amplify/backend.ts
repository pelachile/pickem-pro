import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { espnSync } from './functions/espn-sync/resource';

/**
 * Backend configuration for Pick'em Pro
 * - auth: AWS Cognito authentication
 * - data: GraphQL API with DynamoDB (hybrid static/dynamic data)
 * - espnSync: Scheduled Lambda for ESPN API integration
 */
defineBackend({
  auth,
  data,
  espnSync,
});
