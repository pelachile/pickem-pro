import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { getGameSchedule } from './functions/getGameSchedule/resource';
import { getTeamInfo } from './functions/getTeamInfo/resource';
import { getLiveScores } from './functions/getLiveScores/resource';
import { scheduleDataUpdate } from './functions/scheduleDataUpdate/resource';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
  getGameSchedule,
  getTeamInfo,
  getLiveScores,
  scheduleDataUpdate,
});

// Grant the scheduled function permission to invoke other functions
// Note: IAM policies will be added during deployment configuration
