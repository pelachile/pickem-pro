import { defineFunction } from '@aws-amplify/backend';

export const espnSync = defineFunction({
  name: 'espn-sync',
  entry: './handler.ts',
  environment: {
    // Environment variables will be automatically injected by Amplify
  },
  runtime: 20, // Node.js 20
  timeoutSeconds: 300, // 5 minutes timeout for ESPN API calls
  memoryMB: 512, // Enough memory for HTTP requests and JSON parsing
  // TODO: Add schedule configuration once we figure out the correct syntax
  // schedule: 'rate(5 minutes)' // Run every 5 minutes
});