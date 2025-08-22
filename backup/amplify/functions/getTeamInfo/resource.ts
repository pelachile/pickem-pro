import { defineFunction } from '@aws-amplify/backend';

export const getTeamInfo = defineFunction({
  name: 'getTeamInfo',
  entry: './handler.ts',
  environment: {
    ESPN_API_BASE_URL: 'https://site.api.espn.com/apis/site/v2/sports/football/nfl',
    DATA_FILE_PATH: '/tmp/team-data.json',
    LOG_LEVEL: 'info'
  },
  timeoutSeconds: 120, // Increased for ETL processing
  memoryMB: 512 // Increased for data processing
});