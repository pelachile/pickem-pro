import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/*== HYBRID DATA ARCHITECTURE ============================================
Static Data (CDN/JSON): Teams, schedules, venue info - rarely changes
Dynamic Data (AWS): Live scores, game status, team records - updates every 5 minutes

This schema defines only the dynamic data that changes frequently during games.
========================================================================*/
const schema = a.schema({
  // Live game status and scores (updated every 5 minutes during games)
  GameStatus: a
    .model({
      espn_id: a.string().required(), // Links to static game data
      home_score: a.integer(),
      away_score: a.integer(),
      status: a.enum(['scheduled', 'in_progress', 'final', 'postponed', 'cancelled']),
      quarter: a.string(), // "1st", "2nd", "3rd", "4th", "OT", "Final"
      time_remaining: a.string(), // "14:32", "0:00", etc.
      game_status_detail: a.string(), // "End of 1st Quarter", "Halftime", etc.
      has_started: a.boolean().default(false),
      has_finished: a.boolean().default(false),
      last_updated: a.datetime().required(),
      season_year: a.integer().required(),
      week: a.integer().required(),
    })
    .authorization((allow) => [
      allow.guest().to(['read']), // Public read access for game data
      allow.authenticated().to(['read']), // Authenticated users can read
      // Only Lambda functions can write (via service role)
    ])
    .identifier(['espn_id']), // Use ESPN ID as primary key

  // Team season records (wins/losses updated after each game)
  TeamRecord: a
    .model({
      espn_id: a.string().required(), // Links to static team data
      season_year: a.integer().required(),
      wins: a.integer().default(0),
      losses: a.integer().default(0),
      ties: a.integer().default(0),
      win_percentage: a.float(),
      points_for: a.integer().default(0),
      points_against: a.integer().default(0),
      point_differential: a.integer().default(0),
      streak: a.string(), // "W3", "L1", etc.
      last_updated: a.datetime().required(),
    })
    .authorization((allow) => [
      allow.guest().to(['read']),
      allow.authenticated().to(['read']),
    ])
    .identifier(['espn_id', 'season_year']), // Composite key

  // Major game events (scoring plays, etc.)
  GameEvent: a
    .model({
      game_espn_id: a.string().required(),
      event_id: a.string().required(), // ESPN event ID
      event_type: a.enum(['touchdown', 'field_goal', 'safety', 'two_point', 'quarter_end', 'game_end']),
      description: a.string().required(),
      score_change: a.json(), // { home: number, away: number }
      quarter: a.string(),
      time_remaining: a.string(),
      timestamp: a.datetime().required(),
    })
    .authorization((allow) => [
      allow.guest().to(['read']),
      allow.authenticated().to(['read']),
    ]),

  // League system tables
  League: a
    .model({
      name: a.string().required(),
      description: a.string(),
      owner: a.string().required(), // User ID (Amplify default owner field)
      entry_fee: a.integer(),
      max_members: a.integer().required(),
      is_private: a.boolean(),
      password_hash: a.string(),
      invite_code: a.string().required(),
      status: a.enum(['active', 'inactive', 'completed']),
    })
    .authorization((allow) => [
      allow.authenticated().to(['create', 'read']),
      allow.owner().to(['read', 'update', 'delete']),
    ]),

  LeagueMember: a
    .model({
      league_id: a.string().required(),
      owner: a.string().required(), // User ID (Amplify default owner field)
      role: a.enum(['admin', 'member']),
    })
    .authorization((allow) => [
      allow.authenticated().to(['create', 'read']),
      allow.owner().to(['read', 'delete']),
    ]),

  LeagueInvite: a
    .model({
      league_id: a.string().required(),
      owner: a.string().required(), // User ID (Amplify default owner field)
      invite_code: a.string().required(),
      expires_at: a.datetime(),
      max_uses: a.integer(),
      uses_count: a.integer(),
    })
    .authorization((allow) => [
      allow.authenticated().to(['create', 'read']),
      allow.owner().to(['read', 'update', 'delete']),
    ]),

  // User Profile system
  UserProfile: a
    .model({
      username: a.string(),
      full_name: a.string(),
      avatar_url: a.string(),
      avatar_icon: a.string().default('👤'), // Emoji icon
      avatar_color: a.string().default('ocean-blue'), // Color theme
      website: a.string(),
      bio: a.string(),
      is_public: a.boolean().default(true),
      owner: a.string().required(), // User ID (Amplify default owner field)
    })
    .authorization((allow) => [
      allow.authenticated().to(['create', 'read']),
      allow.owner().to(['read', 'update', 'delete']),
      // Public profiles can be read by guests
      allow.guest().to(['read']),
    ]),

  // Keep existing Todo for now (can remove later)
  Todo: a
    .model({
      content: a.string(),
    })
    .authorization((allow) => [allow.guest()]),

  // AI-enhanced player data models
  Player: a
    .model({
      // Basic player info
      name: a.string().required(),
      team: a.string().required(), // Team abbreviation
      position: a.string().required(),
      tier: a.string(), // "Elite", "High-End RB1", etc.
      
      // AI-generated projections
      top5_likelihood: a.float(), // 0-100 percentage
      fantasy_points: a.float(),
      weekly_floor: a.float(),
      weekly_ceiling: a.float(),
      
      // 2024 stats
      games_played: a.integer().default(0),
      injury_history: a.json(), // Array of injury records
      fantasy_rank: a.integer(),
      position_stats: a.json(), // Position-specific stats object
      
      // AI analysis content
      summary: a.string(),
      strengths: a.json(), // Array of strength strings
      concerns: a.json(), // Array of concern strings
      key_factors: a.json(), // Array of key factor strings
      upside: a.string(),
      floor: a.string(),
      
      // AI metadata
      ai_last_updated: a.datetime().required(),
      news_analysis: a.string(),
      injury_update: a.string(),
      trending_factors: a.json(), // Array of trending topics
      sentiment_score: a.float(), // -1 to 1 sentiment analysis
      
      // Metadata
      season_year: a.integer().required(),
      week: a.integer().required(),
    })
    .authorization((allow) => [
      allow.authenticated().to(['read']),
      // Only Lambda functions can write (via service role)
    ])
    .secondaryIndexes((index) => [
      index('position').sortKeys(['fantasy_rank']).queryField('byPosition'),
      index('team').sortKeys(['position', 'fantasy_rank']).queryField('byTeam'),
      index('season_year').sortKeys(['week', 'fantasy_rank']).queryField('bySeason'),
    ]),

  NFLTeam: a
    .model({
      // Basic team info
      name: a.string().required(),
      abbreviation: a.string().required(),
      city: a.string().required(),
      conference: a.string().required(), // "AFC" or "NFC"
      division: a.string().required(), // "North", "South", "East", "West"
      
      // Team analysis
      season_outlook: a.string(),
      strengths: a.json(), // Array of strength strings
      weaknesses: a.json(), // Array of weakness strings
      key_injuries: a.json(), // Array of injury reports
      coaching_changes: a.string(),
      
      // AI-generated weekly content
      weekly_highlights: a.string(),
      injury_report: a.string(),
      fantasy_relevant_news: a.string(),
      game_preview: a.string(),
      
      // Metadata
      season_year: a.integer().required(),
      week: a.integer().required(),
      ai_last_updated: a.datetime().required(),
    })
    .authorization((allow) => [
      allow.authenticated().to(['read']),
      allow.guest().to(['read']), // Public team data
    ])
    .identifier(['abbreviation', 'season_year'])
    .secondaryIndexes((index) => [
      index('conference').sortKeys(['division', 'abbreviation']).queryField('byConference'),
      index('division').sortKeys(['abbreviation']).queryField('byDivision'),
      index('season_year').sortKeys(['week', 'abbreviation']).queryField('bySeasonWeek'),
    ]),

  AIContentCache: a
    .model({
      content_type: a.string().required(), // "player_analysis", "team_preview", etc.
      content_key: a.string().required(), // Unique identifier for the content
      content: a.json().required(), // The cached AI-generated content
      expires_at: a.datetime().required(), // TTL for cache invalidation
      
      // Metadata
      created_at: a.datetime().required(),
      hit_count: a.integer().default(0), // Track cache usage
      last_accessed: a.datetime(),
    })
    .authorization((allow) => [
      allow.authenticated().to(['read']),
      // Only Lambda functions can write (via service role)
    ])
    .identifier(['content_type', 'content_key'])
    .secondaryIndexes((index) => [
      index('expires_at').queryField('byExpiration'), // For cleanup jobs
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
