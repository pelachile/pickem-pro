import { defineFunction } from '@aws-amplify/backend';

export const getGameSchedule = defineFunction({
  name: 'getGameSchedule',
  entry: './handler.ts',
  environment: {
    ESPN_API_BASE_URL: 'https://site.api.espn.com/apis/site/v2/sports/football/nfl',
    DATA_FILE_PATH: '/tmp/schedule-data.json',
    LOG_LEVEL: 'info'
  },
  timeoutSeconds: 120, // Increased for ETL processing
  memoryMB: 512 // Increased for data processing
});