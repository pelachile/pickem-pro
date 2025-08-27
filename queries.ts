/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getGameEvent = /* GraphQL */ `query GetGameEvent($id: ID!) {
  getGameEvent(id: $id) {
    createdAt
    description
    event_id
    event_type
    game_espn_id
    id
    quarter
    score_change
    time_remaining
    timestamp
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetGameEventQueryVariables,
  APITypes.GetGameEventQuery
>;
export const getGameStatus = /* GraphQL */ `query GetGameStatus($espn_id: String!) {
  getGameStatus(espn_id: $espn_id) {
    away_score
    createdAt
    espn_id
    game_status_detail
    has_finished
    has_started
    home_score
    last_updated
    quarter
    season_year
    status
    time_remaining
    updatedAt
    week
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetGameStatusQueryVariables,
  APITypes.GetGameStatusQuery
>;
export const getLeague = /* GraphQL */ `query GetLeague($id: ID!) {
  getLeague(id: $id) {
    createdAt
    description
    entry_fee
    id
    invite_code
    is_private
    max_members
    name
    owner
    password_hash
    status
    updatedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.GetLeagueQueryVariables, APITypes.GetLeagueQuery>;
export const getLeagueInvite = /* GraphQL */ `query GetLeagueInvite($id: ID!) {
  getLeagueInvite(id: $id) {
    createdAt
    expires_at
    id
    invite_code
    league_id
    max_uses
    owner
    updatedAt
    uses_count
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetLeagueInviteQueryVariables,
  APITypes.GetLeagueInviteQuery
>;
export const getLeagueMember = /* GraphQL */ `query GetLeagueMember($id: ID!) {
  getLeagueMember(id: $id) {
    createdAt
    id
    league_id
    owner
    role
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetLeagueMemberQueryVariables,
  APITypes.GetLeagueMemberQuery
>;
export const getTeamRecord = /* GraphQL */ `query GetTeamRecord($espn_id: String!, $season_year: Int!) {
  getTeamRecord(espn_id: $espn_id, season_year: $season_year) {
    createdAt
    espn_id
    last_updated
    losses
    point_differential
    points_against
    points_for
    season_year
    streak
    ties
    updatedAt
    win_percentage
    wins
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetTeamRecordQueryVariables,
  APITypes.GetTeamRecordQuery
>;
export const getTodo = /* GraphQL */ `query GetTodo($id: ID!) {
  getTodo(id: $id) {
    content
    createdAt
    id
    updatedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.GetTodoQueryVariables, APITypes.GetTodoQuery>;
export const listGameEvents = /* GraphQL */ `query ListGameEvents(
  $filter: ModelGameEventFilterInput
  $limit: Int
  $nextToken: String
) {
  listGameEvents(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      createdAt
      description
      event_id
      event_type
      game_espn_id
      id
      quarter
      score_change
      time_remaining
      timestamp
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListGameEventsQueryVariables,
  APITypes.ListGameEventsQuery
>;
export const listGameStatuses = /* GraphQL */ `query ListGameStatuses(
  $espn_id: String
  $filter: ModelGameStatusFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listGameStatuses(
    espn_id: $espn_id
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
      away_score
      createdAt
      espn_id
      game_status_detail
      has_finished
      has_started
      home_score
      last_updated
      quarter
      season_year
      status
      time_remaining
      updatedAt
      week
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListGameStatusesQueryVariables,
  APITypes.ListGameStatusesQuery
>;
export const listLeagueInvites = /* GraphQL */ `query ListLeagueInvites(
  $filter: ModelLeagueInviteFilterInput
  $limit: Int
  $nextToken: String
) {
  listLeagueInvites(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      createdAt
      expires_at
      id
      invite_code
      league_id
      max_uses
      owner
      updatedAt
      uses_count
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListLeagueInvitesQueryVariables,
  APITypes.ListLeagueInvitesQuery
>;
export const listLeagueMembers = /* GraphQL */ `query ListLeagueMembers(
  $filter: ModelLeagueMemberFilterInput
  $limit: Int
  $nextToken: String
) {
  listLeagueMembers(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      createdAt
      id
      league_id
      owner
      role
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListLeagueMembersQueryVariables,
  APITypes.ListLeagueMembersQuery
>;
export const listLeagues = /* GraphQL */ `query ListLeagues(
  $filter: ModelLeagueFilterInput
  $limit: Int
  $nextToken: String
) {
  listLeagues(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      createdAt
      description
      entry_fee
      id
      invite_code
      is_private
      max_members
      name
      owner
      password_hash
      status
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListLeaguesQueryVariables,
  APITypes.ListLeaguesQuery
>;
export const listTeamRecords = /* GraphQL */ `query ListTeamRecords(
  $espn_id: String
  $filter: ModelTeamRecordFilterInput
  $limit: Int
  $nextToken: String
  $season_year: ModelIntKeyConditionInput
  $sortDirection: ModelSortDirection
) {
  listTeamRecords(
    espn_id: $espn_id
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    season_year: $season_year
    sortDirection: $sortDirection
  ) {
    items {
      createdAt
      espn_id
      last_updated
      losses
      point_differential
      points_against
      points_for
      season_year
      streak
      ties
      updatedAt
      win_percentage
      wins
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListTeamRecordsQueryVariables,
  APITypes.ListTeamRecordsQuery
>;
export const listTodos = /* GraphQL */ `query ListTodos(
  $filter: ModelTodoFilterInput
  $limit: Int
  $nextToken: String
) {
  listTodos(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      content
      createdAt
      id
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<APITypes.ListTodosQueryVariables, APITypes.ListTodosQuery>;
