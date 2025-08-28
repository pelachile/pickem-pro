import { defineFunction } from '@aws-amplify/backend';

export const aiAnalysis = defineFunction({
  name: 'ai-analysis',
  entry: './handler.ts',
  environment: {
    // Environment variables will be automatically injected by Amplify
  },
  runtime: 20, // Node.js 20
  timeoutSeconds: 900, // 15 minutes timeout for AI analysis (max Lambda timeout)
  memoryMB: 1024, // Higher memory for AI processing and large JSON operations
  // Schedule for weekly updates (Sundays at 6 AM EST)
  // schedule: 'cron(0 11 ? * SUN *)', // 11:00 UTC = 6:00 AM EST
});