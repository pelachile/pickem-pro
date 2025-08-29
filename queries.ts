/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const byConference = /* GraphQL */ `query ByConference(
  $conference: String!
  $divisionAbbreviation: ModelNFLTeamNFLTeamsByConferenceAndDivisionAndAbbreviationCompositeKeyConditionInput
  $filter: ModelNFLTeamFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  byConference(
    conference: $conference
    divisionAbbreviation: $divisionAbbreviation
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
      abbreviation
      ai_last_updated
      city
      coaching_changes
      conference
      createdAt
      division
      fantasy_relevant_news
      game_preview
      injury_report
      key_injuries
      name
      season_outlook
      season_year
      strengths
      updatedAt
      weaknesses
      week
      weekly_highlights
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ByConferenceQueryVariables,
  APITypes.ByConferenceQuery
>;
export const byDivision = /* GraphQL */ `query ByDivision(
  $abbreviation: ModelStringKeyConditionInput
  $division: String!
  $filter: ModelNFLTeamFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  byDivision(
    abbreviation: $abbreviation
    division: $division
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
      abbreviation
      ai_last_updated
      city
      coaching_changes
      conference
      createdAt
      division
      fantasy_relevant_news
      game_preview
      injury_report
      key_injuries
      name
      season_outlook
      season_year
      strengths
      updatedAt
      weaknesses
      week
      weekly_highlights
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ByDivisionQueryVariables,
  APITypes.ByDivisionQuery
>;
export const byExpiration = /* GraphQL */ `query ByExpiration(
  $expires_at: AWSDateTime!
  $filter: ModelAIContentCacheFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  byExpiration(
    expires_at: $expires_at
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
      content
      content_key
      content_type
      createdAt
      created_at
      expires_at
      hit_count
      last_accessed
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ByExpirationQueryVariables,
  APITypes.ByExpirationQuery
>;
export const byPosition = /* GraphQL */ `query ByPosition(
  $fantasy_rank: ModelIntKeyConditionInput
  $filter: ModelPlayerFilterInput
  $limit: Int
  $nextToken: String
  $position: String!
  $sortDirection: ModelSortDirection
) {
  byPosition(
    fantasy_rank: $fantasy_rank
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    position: $position
    sortDirection: $sortDirection
  ) {
    items {
      ai_last_updated
      concerns
      createdAt
      fantasy_points
      fantasy_rank
      floor
      games_played
      id
      injury_history
      injury_update
      key_factors
      name
      news_analysis
      position
      position_stats
      season_year
      sentiment_score
      strengths
      summary
      team
      tier
      top5_likelihood
      trending_factors
      updatedAt
      upside
      week
      weekly_ceiling
      weekly_floor
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ByPositionQueryVariables,
  APITypes.ByPositionQuery
>;
export const bySeason = /* GraphQL */ `query BySeason(
  $filter: ModelPlayerFilterInput
  $limit: Int
  $nextToken: String
  $season_year: Int!
  $sortDirection: ModelSortDirection
  $weekFantasy_rank: ModelPlayerPlayersBySeason_yearAndWeekAndFantasy_rankCompositeKeyConditionInput
) {
  bySeason(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    season_year: $season_year
    sortDirection: $sortDirection
    weekFantasy_rank: $weekFantasy_rank
  ) {
    items {
      ai_last_updated
      concerns
      createdAt
      fantasy_points
      fantasy_rank
      floor
      games_played
      id
      injury_history
      injury_update
      key_factors
      name
      news_analysis
      position
      position_stats
      season_year
      sentiment_score
      strengths
      summary
      team
      tier
      top5_likelihood
      trending_factors
      updatedAt
      upside
      week
      weekly_ceiling
      weekly_floor
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<APITypes.BySeasonQueryVariables, APITypes.BySeasonQuery>;
export const bySeasonWeek = /* GraphQL */ `query BySeasonWeek(
  $filter: ModelNFLTeamFilterInput
  $limit: Int
  $nextToken: String
  $season_year: Int!
  $sortDirection: ModelSortDirection
  $weekAbbreviation: ModelNFLTeamNFLTeamsBySeason_yearAndWeekAndAbbreviationCompositeKeyConditionInput
) {
  bySeasonWeek(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    season_year: $season_year
    sortDirection: $sortDirection
    weekAbbreviation: $weekAbbreviation
  ) {
    items {
      abbreviation
      ai_last_updated
      city
      coaching_changes
      conference
      createdAt
      division
      fantasy_relevant_news
      game_preview
      injury_report
      key_injuries
      name
      season_outlook
      season_year
      strengths
      updatedAt
      weaknesses
      week
      weekly_highlights
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.BySeasonWeekQueryVariables,
  APITypes.BySeasonWeekQuery
>;
export const byTeam = /* GraphQL */ `query ByTeam(
  $filter: ModelPlayerFilterInput
  $limit: Int
  $nextToken: String
  $positionFantasy_rank: ModelPlayerPlayersByTeamAndPositionAndFantasy_rankCompositeKeyConditionInput
  $sortDirection: ModelSortDirection
  $team: String!
) {
  byTeam(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    positionFantasy_rank: $positionFantasy_rank
    sortDirection: $sortDirection
    team: $team
  ) {
    items {
      ai_last_updated
      concerns
      createdAt
      fantasy_points
      fantasy_rank
      floor
      games_played
      id
      injury_history
      injury_update
      key_factors
      name
      news_analysis
      position
      position_stats
      season_year
      sentiment_score
      strengths
      summary
      team
      tier
      top5_likelihood
      trending_factors
      updatedAt
      upside
      week
      weekly_ceiling
      weekly_floor
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<APITypes.ByTeamQueryVariables, APITypes.ByTeamQuery>;
export const getAIContentCache = /* GraphQL */ `query GetAIContentCache($content_key: String!, $content_type: String!) {
  getAIContentCache(content_key: $content_key, content_type: $content_type) {
    content
    content_key
    content_type
    createdAt
    created_at
    expires_at
    hit_count
    last_accessed
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetAIContentCacheQueryVariables,
  APITypes.GetAIContentCacheQuery
>;
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
export const getNFLTeam = /* GraphQL */ `query GetNFLTeam($abbreviation: String!, $season_year: Int!) {
  getNFLTeam(abbreviation: $abbreviation, season_year: $season_year) {
    abbreviation
    ai_last_updated
    city
    coaching_changes
    conference
    createdAt
    division
    fantasy_relevant_news
    game_preview
    injury_report
    key_injuries
    name
    season_outlook
    season_year
    strengths
    updatedAt
    weaknesses
    week
    weekly_highlights
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetNFLTeamQueryVariables,
  APITypes.GetNFLTeamQuery
>;
export const getPlayer = /* GraphQL */ `query GetPlayer($id: ID!) {
  getPlayer(id: $id) {
    ai_last_updated
    concerns
    createdAt
    fantasy_points
    fantasy_rank
    floor
    games_played
    id
    injury_history
    injury_update
    key_factors
    name
    news_analysis
    position
    position_stats
    season_year
    sentiment_score
    strengths
    summary
    team
    tier
    top5_likelihood
    trending_factors
    updatedAt
    upside
    week
    weekly_ceiling
    weekly_floor
    __typename
  }
}
` as GeneratedQuery<APITypes.GetPlayerQueryVariables, APITypes.GetPlayerQuery>;
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
export const getUserProfile = /* GraphQL */ `query GetUserProfile($id: ID!) {
  getUserProfile(id: $id) {
    avatar_color
    avatar_icon
    avatar_url
    bio
    createdAt
    full_name
    id
    is_public
    owner
    updatedAt
    username
    website
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetUserProfileQueryVariables,
  APITypes.GetUserProfileQuery
>;
export const listAIContentCaches = /* GraphQL */ `query ListAIContentCaches(
  $content_key: ModelStringKeyConditionInput
  $content_type: String
  $filter: ModelAIContentCacheFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listAIContentCaches(
    content_key: $content_key
    content_type: $content_type
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
      content
      content_key
      content_type
      createdAt
      created_at
      expires_at
      hit_count
      last_accessed
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAIContentCachesQueryVariables,
  APITypes.ListAIContentCachesQuery
>;
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
export const listNFLTeams = /* GraphQL */ `query ListNFLTeams(
  $abbreviation: String
  $filter: ModelNFLTeamFilterInput
  $limit: Int
  $nextToken: String
  $season_year: ModelIntKeyConditionInput
  $sortDirection: ModelSortDirection
) {
  listNFLTeams(
    abbreviation: $abbreviation
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    season_year: $season_year
    sortDirection: $sortDirection
  ) {
    items {
      abbreviation
      ai_last_updated
      city
      coaching_changes
      conference
      createdAt
      division
      fantasy_relevant_news
      game_preview
      injury_report
      key_injuries
      name
      season_outlook
      season_year
      strengths
      updatedAt
      weaknesses
      week
      weekly_highlights
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListNFLTeamsQueryVariables,
  APITypes.ListNFLTeamsQuery
>;
export const listPlayers = /* GraphQL */ `query ListPlayers(
  $filter: ModelPlayerFilterInput
  $limit: Int
  $nextToken: String
) {
  listPlayers(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      ai_last_updated
      concerns
      createdAt
      fantasy_points
      fantasy_rank
      floor
      games_played
      id
      injury_history
      injury_update
      key_factors
      name
      news_analysis
      position
      position_stats
      season_year
      sentiment_score
      strengths
      summary
      team
      tier
      top5_likelihood
      trending_factors
      updatedAt
      upside
      week
      weekly_ceiling
      weekly_floor
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPlayersQueryVariables,
  APITypes.ListPlayersQuery
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
export const listUserProfiles = /* GraphQL */ `query ListUserProfiles(
  $filter: ModelUserProfileFilterInput
  $limit: Int
  $nextToken: String
) {
  listUserProfiles(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      avatar_color
      avatar_icon
      avatar_url
      bio
      createdAt
      full_name
      id
      is_public
      owner
      updatedAt
      username
      website
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListUserProfilesQueryVariables,
  APITypes.ListUserProfilesQuery
>;
export const sayHello = /* GraphQL */ `query SayHello($name: String) {
  sayHello(name: $name) {
    message
    __typename
  }
}
` as GeneratedQuery<APITypes.SayHelloQueryVariables, APITypes.SayHelloQuery>;
