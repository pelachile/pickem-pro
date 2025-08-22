import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/*== NFL PICK'EM APP DATA SCHEMA ==========================================
This schema defines the data models for an NFL Pick'em application:
- Team: NFL team information with ESPN API integration
- Game: Individual NFL games with scores and status
- Schedule: Weekly schedule organization
- Pick: User picks for games (future implementation)
=========================================================================*/

const schema = a.schema({
  // NFL Team model with full team information and branding
  Team: a
    .model({
      name: a.string().required(),
      abbreviation: a.string().required(),
      location: a.string().required(),
      display_name: a.string().required(),
      conference: a.string().required(), // AFC or NFC
      division: a.string().required(), // North, South, East, West
      logo_url: a.string(),
      primary_color: a.string(),
      secondary_color: a.string(),
      espn_id: a.string().required(), // For ESPN API mapping
      // Relationships
      homeGames: a.hasMany('Game', 'homeTeamId'),
      awayGames: a.hasMany('Game', 'awayTeamId'),
      picks: a.hasMany('Pick', 'pickedTeamId'),
    })
    .authorization((allow) => [
      allow.guest().to(['read']),
      allow.authenticated().to(['read']),
    ]),

  // NFL Game model with complete game information
  Game: a
    .model({
      espn_id: a.string().required(),
      season: a.integer().required(),
      week: a.integer().required(),
      season_type: a.string().required(), // regular, postseason, preseason
      homeTeamId: a.id(),
      awayTeamId: a.id(),
      homeTeam: a.belongsTo('Team', 'homeTeamId'),
      awayTeam: a.belongsTo('Team', 'awayTeamId'),
      game_date: a.datetime().required(),
      status: a.string().required(), // scheduled, in_progress, completed, postponed
      venue_name: a.string(),
      home_score: a.integer().default(0),
      away_score: a.integer().default(0),
      is_scheduled: a.boolean().default(true),
      is_in_progress: a.boolean().default(false),
      is_completed: a.boolean().default(false),
      quarter: a.string(), // Current quarter/period
      time_remaining: a.string(), // Time remaining in current quarter
      last_updated: a.datetime(),
      // Relationships
      picks: a.hasMany('Pick', 'gameId'),
    })
    .authorization((allow) => [
      allow.guest().to(['read']),
      allow.authenticated().to(['read']),
    ]),

  // Schedule model to organize games by week
  Schedule: a
    .model({
      season: a.integer().required(),
      week: a.integer().required(),
      season_type: a.string().required(),
      total_games: a.integer().default(0),
      completed_games: a.integer().default(0),
      last_updated: a.datetime(),
    })
    .authorization((allow) => [
      allow.guest().to(['read']),
      allow.authenticated().to(['read']),
    ]),

  // User Pick model for game predictions
  Pick: a
    .model({
      user_id: a.string().required(),
      gameId: a.id(),
      pickedTeamId: a.id(),
      game: a.belongsTo('Game', 'gameId'),
      pickedTeam: a.belongsTo('Team', 'pickedTeamId'),
      confidence_points: a.integer().default(1),
      is_correct: a.boolean(),
      points_earned: a.integer().default(0),
      created_at: a.datetime(),
      updated_at: a.datetime(),
    })
    .authorization((allow) => [
      allow.owner().to(['create', 'read', 'update', 'delete']),
      allow.authenticated().to(['read']),
    ]),

  // League model for organizing users into Pick'em leagues
  League: a
    .model({
      name: a.string().required(),
      description: a.string(),
      commissioner_id: a.string().required(),
      season: a.integer().required(),
      league_type: a.string().required(), // standard, confidence, survivor
      max_members: a.integer().default(20),
      is_public: a.boolean().default(false),
      invite_code: a.string(),
      current_week: a.integer().default(1),
      settings: a.json(), // League-specific settings
      created_at: a.datetime(),
      // Relationships
      members: a.hasMany('LeagueMember', 'leagueId'),
    })
    .authorization((allow) => [
      allow.owner().to(['create', 'read', 'update', 'delete']),
      allow.authenticated().to(['read']),
    ]),

  // League Membership model to track users in leagues
  LeagueMember: a
    .model({
      leagueId: a.id(),
      league: a.belongsTo('League', 'leagueId'),
      user_id: a.string().required(),
      username: a.string().required(),
      total_points: a.integer().default(0),
      correct_picks: a.integer().default(0),
      total_picks: a.integer().default(0),
      current_streak: a.integer().default(0),
      best_streak: a.integer().default(0),
      joined_at: a.datetime(),
    })
    .authorization((allow) => [
      allow.owner().to(['create', 'read', 'update', 'delete']),
      allow.authenticated().to(['read']),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'identityPool',
  },
});

/*== USAGE EXAMPLES =======================================================
Frontend client generation and usage examples:

1. Generate the client:
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
const client = generateClient<Schema>();

2. Query teams:
const { data: teams } = await client.models.Team.list();

3. Get current week's games:
const { data: games } = await client.models.Game.list({
  filter: {
    week: { eq: currentWeek },
    season: { eq: currentSeason },
    season_type: { eq: "regular" }
  }
});

4. Create a user pick:
const newPick = await client.models.Pick.create({
  game_id: gameId,
  picked_team_id: teamId,
  confidence_points: points
});

5. Get league standings:
const { data: members } = await client.models.LeagueMember.list({
  filter: { league_id: { eq: leagueId } }
});
=========================================================================*/
