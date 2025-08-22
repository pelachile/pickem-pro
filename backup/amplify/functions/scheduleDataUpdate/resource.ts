import { defineFunction } from '@aws-amplify/backend';

export const scheduleDataUpdate = defineFunction({
  name: 'scheduleDataUpdate',
  entry: './handler.ts',
  environment: {
    GET_GAME_SCHEDULE_FUNCTION_NAME: 'getGameSchedule',
    GET_TEAM_INFO_FUNCTION_NAME: 'getTeamInfo',
    GET_LIVE_SCORES_FUNCTION_NAME: 'getLiveScores',
    DATA_FILE_PATH: '/tmp/teams-and-schedule.json',
    PUBLIC_DATA_PATH: 'public/data/teams-and-schedule.json',
    LOG_LEVEL: 'info'
  },
  timeoutSeconds: 600, // 10 minutes timeout for ETL pipeline
  memoryMB: 1024, // Increased memory for data processing
  schedule: '0 11 ? * 3 *', // Every Tuesday at 11:00 AM UTC (6:00 AM EST)
});