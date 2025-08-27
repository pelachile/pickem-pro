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
      created_by: a.string().required(), // User ID
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
      user_id: a.string().required(),
      role: a.enum(['admin', 'member']),
    })
    .authorization((allow) => [
      allow.authenticated().to(['create', 'read']),
      allow.owner().to(['read', 'delete']),
    ]),

  LeagueInvite: a
    .model({
      league_id: a.string().required(),
      created_by: a.string().required(),
      invite_code: a.string().required(),
      expires_at: a.datetime(),
      max_uses: a.integer(),
      uses_count: a.integer(),
    })
    .authorization((allow) => [
      allow.authenticated().to(['create', 'read']),
      allow.owner().to(['read', 'update', 'delete']),
    ]),

  // Keep existing Todo for now (can remove later)
  Todo: a
    .model({
      content: a.string(),
    })
    .authorization((allow) => [allow.guest()]),
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
